<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['category', 'instructor'])->get();
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'numeric|min:0',
        ]);

        // نفترض أن المستخدم الحالي هو المدرب (أو الآدمن)
        $validated['instructor_id'] = $request->user()->id;
        $validated['status'] = 'published'; // للتبسيط حالياً

        $course = Course::create($validated);

        return response()->json([
            'message' => 'تم إنشاء الدورة بنجاح',
            'course' => $course->load(['category', 'instructor'])
        ], 201);
    }

    public function show($id)
    {
        $course = Course::with(['category', 'instructor', 'lessons'])->findOrFail($id);
        return response()->json($course);
    }
}
