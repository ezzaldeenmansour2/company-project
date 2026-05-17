<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Course;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'content_type' => 'required|in:video,file,text',
            'content_body' => 'required|string',
            'order' => 'integer',
        ]);

        // التحقق من أن المستخدم هو صاحب الدورة أو مسؤول
        $course = Course::findOrFail($validated['course_id']);
        if ($request->user()->id !== $course->instructor_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'غير مصرح لك بإضافة دروس لهذه الدورة'], 403);
        }

        $lesson = Lesson::create($validated);

        return response()->json([
            'message' => 'تم إضافة الدرس بنجاح',
            'lesson' => $lesson
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);
        $validated = $request->validate([
            'title' => 'string|max:255',
            'content_type' => 'in:video,file,text',
            'content_body' => 'string',
            'order' => 'integer',
            'is_hidden' => 'boolean',
        ]);

        $lesson->update($validated);

        return response()->json([
            'message' => 'تم تحديث الدرس بنجاح',
            'lesson' => $lesson
        ]);
    }

    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json(['message' => 'تم حذف الدرس بنجاح']);
    }
}
