<?php

namespace App\Policies;

use App\Models\AttendanceSession;
use App\Models\User;
use App\Models\Enrollment;
use Illuminate\Auth\Access\Response;

class AttendanceSessionPolicy
{
    /**
     * Determine whether the user can view/manage the session.
     */
    public function manage(User $user, AttendanceSession $attendanceSession): bool
    {
        return $user->id === $attendanceSession->instructor_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can mark attendance in the session.
     */
    public function attend(User $user, AttendanceSession $attendanceSession): bool
    {
        if (!$user->isStudent()) {
            return false;
        }

        // Check if student is enrolled in the course
        return Enrollment::where('user_id', $user->id)
            ->where('course_id', $attendanceSession->course_id)
            ->where('status', 'active')
            ->exists();
    }
}
