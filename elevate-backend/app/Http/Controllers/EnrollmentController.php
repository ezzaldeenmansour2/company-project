<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    /**
     * جلب الدورات التي اشترك فيها الطالب الحالي
     */
    public function myCourses()
    {
        $user = Auth::user();
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.category', 'course.instructor'])
            ->get();
        
        return response()->json($enrollments->pluck('course'));
    }

    /**
     * الاشتراك في دورة جديدة
     */
    public function enroll(Request $request, $courseId)
    {
        $user = Auth::user();
        $course = Course::findOrFail($courseId);

        // التحقق مما إذا كان الطالب مشتركاً بالفعل
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'أنت مشترك بالفعل في هذه الدورة'], 400);
        }

        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'تم الاشتراك في الدورة بنجاح',
            'enrollment' => $enrollment
        ], 201);
    }

    /**
     * جلب حالة الاشتراك لدورة معينة
     */
    public function checkStatus($courseId)
    {
        $user = Auth::user();
        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        return response()->json(['is_enrolled' => $isEnrolled]);
    }
}
