<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AttendanceController extends Controller
{
    /**
     * بدء جلسة تحضير جديدة (للمدرب)
     */
    public function startSession(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'radius' => 'nullable|integer|min:10',
        ]);

        $session = AttendanceSession::create([
            'course_id' => $request->course_id,
            'instructor_id' => Auth::id(),
            'status' => 'active',
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'radius' => $request->radius ?? 100,
            'started_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم بدء جلسة التحضير بنجاح',
            'session' => $session
        ]);
    }

    /**
     * جلب الجلسة النشطة لدورة معينة
     */
    public function getActiveSession($courseId)
    {
        $session = AttendanceSession::where('course_id', $courseId)
            ->where('status', 'active')
            ->first();

        return response()->json(['session' => $session]);
    }

    /**
     * توليد توكن QR ديناميكي (يتغير كل 5 ثوانٍ)
     */
    public function generateQR($sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);
        
        if ($session->status !== 'active') {
            return response()->json(['message' => 'الجلسة غير نشطة'], 400);
        }

        // توليد توكن يعتمد على الوقت (كل 5 ثوانٍ)
        $timeSlice = floor(time() / 5);
        $token = hash('sha256', "elevate_qr_{$sessionId}_{$timeSlice}");

        // تخزين التوكن في الكاش للتحقق لاحقاً (صالح لـ 7 ثوانٍ لتجنب مشاكل التوقيت)
        Cache::put("attendance_token_{$sessionId}", $token, 7);

        return response()->json([
            'qr_token' => $token,
            'expires_in' => 5
        ]);
    }

    /**
     * تسجيل الحضور (للطالب)
     */
    public function markAttendance(Request $request, $sessionId)
    {
        $request->validate([
            'qr_token' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $user = Auth::user();
        $session = AttendanceSession::findOrFail($sessionId);

        if ($session->status !== 'active') {
            return response()->json(['message' => 'الجلسة غير نشطة'], 400);
        }

        // التحقق من التوكن
        $validToken = Cache::get("attendance_token_{$sessionId}");
        if ($request->qr_token !== $validToken) {
            return response()->json(['message' => 'انتهت صلاحية الرمز، يرجى المحاولة مرة أخرى'], 403);
        }

        // التحقق من الموقع الجغرافي (إذا كان مفعلاً للجلسة)
        if ($session->latitude && $session->longitude && $request->latitude && $request->longitude) {
            $distance = $this->calculateDistance(
                $session->latitude, $session->longitude,
                $request->latitude, $request->longitude
            );

            if ($distance > $session->radius) {
                return response()->json([
                    'message' => 'أنت خارج النطاق المسموح به للتحضير. يجب أن تكون في القاعة.',
                    'distance' => round($distance, 2),
                    'max_radius' => $session->radius
                ], 403);
            }
        }

        // التحقق من القفل الذري (Atomic Lock) - منع المسح المتزامن
        $lockKey = "attendance_lock_{$sessionId}";
        if (Cache::has($lockKey)) {
            return response()->json(['message' => 'يتم معالجة طالب آخر حالياً، انتظر ثانية'], 429);
        }

        // وضع القفل لمدة ثانيتين
        Cache::put($lockKey, $user->id, 2);

        // التحقق مما إذا كان الطالب قد حضر بالفعل
        $alreadyMarked = AttendanceRecord::where('attendance_session_id', $sessionId)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyMarked) {
            return response()->json(['message' => 'لقد قمت بتحضير نفسك بالفعل'], 400);
        }

        // تسجيل الحضور
        $record = AttendanceRecord::create([
            'attendance_session_id' => $sessionId,
            'user_id' => $user->id,
            'qr_code_token' => $request->qr_token,
            'status' => 'present',
            'scanned_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم تسجيل حضورك بنجاح!',
            'record' => $record
        ]);
    }

    /**
     * إغلاق الجلسة
     */
    public function closeSession($sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);
        $session->update(['status' => 'closed']);
        return response()->json(['message' => 'تم إغلاق جلسة التحضير']);
    }
    /**
     * حساب المسافة بين نقطتين (Haversine formula) بالمتر
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // بالمتر

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
