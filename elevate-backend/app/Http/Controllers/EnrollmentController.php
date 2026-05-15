<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\CoursePrerequisite;
use App\Models\PrerequisiteException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    /**
     * ÌáÈ ÇáÏæÑÇÊ ÇáÊí ÇÔÊÑß ÝíåÇ ÇáØÇáÈ ÇáÍÇáí
     */
    public function myCourses()
    {
        $user = Auth::user();
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.category', 'course.instructor'])
            ->get();
        
        // íãßä ááæÇÌåÉ ÇáÃãÇãíÉ ÇáÂä ãÚÑÝÉ ãÇ ÅÐÇ ßÇä ÇáØÇáÈ ãÍÙæÑÇð ãä ÎáÇá ÇáÜ pivot¡ æáßä ÇáÏÇáÉ ÇáÃÕáíÉ ßÇäÊ ÊÑÌÚ ÇáÏæÑÉ ÝÞØ
        // ÓäÞæã ÈÏãÌ ÍÇáÉ ÇáÊÓÌíá ãÚ ÈíÇäÇÊ ÇáÏæÑÉ
        $courses = $enrollments->map(function ($enrollment) {
            $course = $enrollment->course;
            $course->enrollment_status = $enrollment->status;
            $course->is_blocked = $enrollment->is_blocked;
            $course->block_reason = $enrollment->block_reason;
            return $course;
        });

        return response()->json($courses);
    }

    /**
     * ÇáÇÔÊÑÇß Ýí ÏæÑÉ ÌÏíÏÉ
     */
    public function enroll(Request $request, $courseId)
    {
        $user = Auth::user();
        $course = Course::findOrFail($courseId);

        // ÇáÊÍÞÞ ããÇ ÅÐÇ ßÇä ÇáØÇáÈ ãÔÊÑßÇð ÈÇáÝÚá
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'ÃäÊ ãÔÊÑß ÈÇáÝÚá Ýí åÐå ÇáÏæÑÉ'], 400);
        }

        // --- äÙÇã ÇáãÊØáÈÇÊ ÇáÃßÇÏíãíÉ (Prerequisites) ---
        $prerequisites = CoursePrerequisite::where('course_id', $courseId)->get();
        if ($prerequisites->isNotEmpty()) {
            foreach ($prerequisites as $prereq) {
                // ÇáÊÍÞÞ åá ÇÌÊÇÒ ÇáØÇáÈ åÐå ÇáÏæÑÉ
                $hasCompletedPrereq = Enrollment::where('user_id', $user->id)
                    ->where('course_id', $prereq->prerequisite_course_id)
                    ->where('status', 'completed')
                    ->exists();

                if (!$hasCompletedPrereq) {
                    // ÇáÊÍÞÞ ãä æÌæÏ ÇÓÊËäÇÁ ãÚÊãÏ
                    $hasApprovedException = PrerequisiteException::where('user_id', $user->id)
                        ->where('course_id', $courseId)
                        ->where('status', 'approved')
                        ->exists();

                    if (!$hasApprovedException) {
                        return response()->json([
                            'message' => 'áã ÊÓÊæÝö ãÊØáÈÇÊ åÐå ÇáÏæÑÉ Ãæ áÇ Êãáß ÇÓÊËäÇÁ ãÚÊãÏ.',
                            'requires_exemption' => true
                        ], 403);
                    }
                }
            }
        }

        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Êã ÇáÇÔÊÑÇß Ýí ÇáÏæÑÉ ÈäÌÇÍ',
            'enrollment' => $enrollment
        ], 201);
    }

    /**
     * ÌáÈ ÍÇáÉ ÇáÇÔÊÑÇß áÏæÑÉ ãÚíäÉ
     */
    public function checkStatus($courseId)
    {
        $user = Auth::user();
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($enrollment) {
            return response()->json([
                'is_enrolled' => true,
                'is_blocked' => $enrollment->is_blocked,
                'block_reason' => $enrollment->block_reason
            ]);
        }

        return response()->json(['is_enrolled' => false]);
    }

    /**
     * ÍÙÑ ØÇáÈ ãä ÇáÏæÑÉ (ÅÏÇÑÉ)
     */
    public function blockStudent(Request $request, $enrollmentId)
    {
        $request->validate([
            'block_reason' => 'required|string',
            'report_document' => 'required|file|mimes:pdf,doc,docx|max:5120' // 5MB Max
        ]);

        $enrollment = Enrollment::findOrFail($enrollmentId);

        $path = $request->file('report_document')->store('block_reports', 'public');

        $enrollment->update([
            'is_blocked' => true,
            'block_reason' => $request->block_reason,
            'block_report_path' => $path
        ]);

        return response()->json(['message' => 'Êã ÍÙÑ ÇáØÇáÈ ÈäÌÇÍ', 'enrollment' => $enrollment]);
    }
}
