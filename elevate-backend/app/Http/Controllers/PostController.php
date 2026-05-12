<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * جلب منشورات دورة معينة
     */
    public function index($courseId)
    {
        $posts = Post::where('course_id', $courseId)
            ->with(['user', 'comments.user'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($posts);
    }

    /**
     * إنشاء منشور جديد
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'content' => 'required|string',
            'type' => 'in:post,poll'
        ]);

        $post = Post::create([
            'course_id' => $request->course_id,
            'user_id' => Auth::id(),
            'content' => $request->content,
            'type' => $request->type ?? 'post'
        ]);

        return response()->json($post->load('user'), 201);
    }

    /**
     * حذف منشور
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        
        // التحقق من أن المستخدم هو صاحب المنشور أو مسؤول
        if ($post->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'غير مصرح لك بحذف هذا المنشور'], 403);
        }

        $post->delete();
        return response()->json(['message' => 'تم حذف المنشور بنجاح']);
    }
}
