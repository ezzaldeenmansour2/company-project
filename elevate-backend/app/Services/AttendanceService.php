<?php

namespace App\Services;

use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class AttendanceService
{
    /**
     * Start a new attendance session
     */
    public function startSession(array $data)
    {
        return AttendanceSession::create([
            'course_id' => $data['course_id'],
            'instructor_id' => Auth::id(),
            'status' => 'active',
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'radius' => $data['radius'] ?? 100,
            'started_at' => now(),
        ]);
    }

    /**
     * Generate dynamic QR token with sliding window support
     */
    public function generateQRToken($sessionId)
    {
        $timeSlice = floor(time() / 3);
        $payload = json_encode(['id' => $sessionId, 't' => $timeSlice, 'r' => Str::random(8)]);
        $token = Crypt::encryptString($payload);

        // Store current and previous tokens to handle network delay (Sliding Window)
        $tokens = Cache::get("attendance_tokens_{$sessionId}", []);
        $tokens[] = $token;
        
        // Keep only the last 3 tokens (approx 9 seconds of validity)
        if (count($tokens) > 3) {
            array_shift($tokens);
        }

        Cache::put("attendance_tokens_{$sessionId}", $tokens, 15);

        return [
            'qr_token' => $token,
            'expires_in' => 3
        ];
    }

    /**
     * Process student attendance scan
     */
    public function markAttendance($sessionId, array $data)
    {
        $user = Auth::user();
        $session = AttendanceSession::findOrFail($sessionId);

        // 1. Validate Session Status
        if ($session->status !== 'active') {
            throw new \Exception('الجلسة غير نشطة حالياً', 400);
        }

        // 2. Sliding Window Token Verification
        $validTokens = Cache::get("attendance_tokens_{$sessionId}", []);
        if (!in_array($data['qr_token'], $validTokens)) {
            throw new \Exception('انتهت صلاحية الرمز، يرجى المحاولة مرة أخرى', 403);
        }

        // 3. Geo-fencing Check (Optional Logging instead of blocking)
        $distance = null;
        if ($session->latitude && $session->longitude && isset($data['latitude']) && isset($data['longitude'])) {
            $distance = $this->calculateDistance(
                $session->latitude, $session->longitude,
                $data['latitude'], $data['longitude']
            );
            // Optionally, you could flag records where $distance > $session->radius
            // instead of throwing an exception, to accommodate online students.
        }

        // 4. Atomic Lock (Per User to prevent double-scan)
        $lockKey = "attendance_lock_{$sessionId}_{$user->id}";
        return Cache::lock($lockKey, 5)->get(function () use ($sessionId, $user, $data) {
            
            // 5. Check if already marked
            $exists = AttendanceRecord::where('attendance_session_id', $sessionId)
                ->where('user_id', $user->id)
                ->exists();

            if ($exists) {
                throw new \Exception('لقد قمت بتسجيل حضورك مسبقاً', 400);
            }

            // 6. Record Attendance
            return DB::transaction(function () use ($sessionId, $user, $data) {
                return AttendanceRecord::create([
                    'attendance_session_id' => $sessionId,
                    'user_id' => $user->id,
                    'qr_code_token' => $data['qr_token'],
                    'status' => 'present',
                    'scanned_at' => now(),
                    'ip_address' => $data['ip_address'] ?? null,
                    'user_agent' => $data['user_agent'] ?? null,
                    'latitude' => $data['latitude'] ?? null,
                    'longitude' => $data['longitude'] ?? null,
                ]);
            });
        });
    }

    /**
     * Calculate distance using Haversine formula
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000;
        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
