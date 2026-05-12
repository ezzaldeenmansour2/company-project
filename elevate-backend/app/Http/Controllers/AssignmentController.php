<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    /**
     * جلب تكاليف دورة معينة
     */
    public function index($courseId)
    {
        $assignments = Assignment::where('course_id', $courseId)
            ->withCount('submissions')
            ->get();
        return response()->json($assignments);
    }

    /**
     * إنشاء تكليف جديد (للمدرب)
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'deadline' => 'required|date',
        ]);

        $assignment = Assignment::create([
            'course_id' => $request->course_id,
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
        ]);

        return response()->json($assignment, 201);
    }

    /**
     * حذف تكليف
     */
    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->delete();
        return response()->json(['message' => 'تم حذف التكليف بنجاح']);
    }
}
