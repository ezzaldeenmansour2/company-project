<?php

namespace App\Http\Controllers;

use App\Services\AttendanceService;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

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

        $session = $this->attendanceService->startSession($request->all());

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
     * توليد توكن QR ديناميكي
     */
    public function generateQR($sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);
        
        // Authorization check via policy
        $this->authorize('manage', $session);

        if ($session->status !== 'active') {
            return response()->json(['message' => 'جلسة التحضير غير نشطة حالياً'], 400);
        }

        $result = $this->attendanceService->generateQRToken($sessionId);

        return response()->json($result);
    }

    /**
     * تسجيل الحضور (للطالب)
     */
    public function markAttendance(Request $request, $sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);

        // Authorization check via policy (ensures student is enrolled)
        $this->authorize('attend', $session);

        $request->validate([
            'qr_token' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $data = $request->all();
        $data['ip_address'] = $request->ip();
        $data['user_agent'] = $request->userAgent();

        try {
            $record = $this->attendanceService->markAttendance($sessionId, $data);
            
            return response()->json([
                'message' => 'تم تسجيل حضورك بنجاح!',
                'record' => $record
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    /**
     * إغلاق الجلسة
     */
    public function closeSession($sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);
        $this->authorize('manage', $session);
        $session->update(['status' => 'closed']);
        return response()->json(['message' => 'تم إغلاق جلسة التحضير']);
    }

    /**
     * جلب قائمة الطلاب الحاضرين في جلسة معينة
     */
    public function getAttendees($sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);
        $this->authorize('manage', $session);

        $records = AttendanceRecord::with('user')
            ->where('attendance_session_id', $sessionId)
            ->orderBy('scanned_at', 'desc')
            ->get();

        return response()->json(['records' => $records]);
    }
}
