<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CourseController extends Controller
{
    public function index()
    {
        $user = Auth::guard('sanctum')->user();
        $courses = Course::with(['category', 'instructor'])->get();

        $now = Carbon::now();

        $courses->map(function ($course) use ($now, $user) {
            $query = Discount::where('course_id', $course->id)
                ->where(function ($q) use ($now) {
                    $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
                })
                ->where(function ($q) use ($now) {
                    $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
                });

            if ($user) {
                $query->where(function ($q) use ($user) {
                    $q->whereNull('user_id')->orWhere('user_id', $user->id);
                });
            } else {
                $query->whereNull('user_id');
            }

            $bestDiscount = $query->orderByDesc('percentage')->first();

            if ($bestDiscount) {
                $course->discount_percentage = $bestDiscount->percentage;
                $course->discounted_price = $course->price - ($course->price * ($bestDiscount->percentage / 100));
            } else {
                $course->discount_percentage = 0;
                $course->discounted_price = $course->price;
            }

            return $course;
        });

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

        $validated['instructor_id'] = $request->user()->id;
        $validated['status'] = 'published'; 

        $course = Course::create($validated);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course->load(['category', 'instructor'])
        ], 201);
    }

    public function show($id)
    {
        $course = Course::with(['category', 'instructor', 'lessons'])->findOrFail($id);
        
        $user = Auth::guard('sanctum')->user();
        $now = Carbon::now();
        
        $query = Discount::where('course_id', $course->id)
                ->where(function ($q) use ($now) {
                    $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
                })
                ->where(function ($q) use ($now) {
                    $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
                });

        if ($user) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('user_id')->orWhere('user_id', $user->id);
            });
        } else {
            $query->whereNull('user_id');
        }

        $bestDiscount = $query->orderByDesc('percentage')->first();

        if ($bestDiscount) {
            $course->discount_percentage = $bestDiscount->percentage;
            $course->discounted_price = $course->price - ($course->price * ($bestDiscount->percentage / 100));
        } else {
            $course->discount_percentage = 0;
            $course->discounted_price = $course->price;
        }

        return response()->json($course);
    }
}
