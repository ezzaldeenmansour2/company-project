<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PollOption;
use App\Models\PollVote;
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
            ->with(['user', 'comments.user', 'pollOptions.votes'])
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
            'type' => 'in:post,poll',
            'options' => 'required_if:type,poll|array|min:2',
            'options.*' => 'required_with:options|string'
        ]);

        $post = Post::create([
            'course_id' => $request->course_id,
            'user_id' => Auth::id(),
            'content' => $request->content,
            'type' => $request->type ?? 'post'
        ]);

        if ($post->type === 'poll' && $request->has('options')) {
            foreach ($request->options as $optionText) {
                PollOption::create([
                    'post_id' => $post->id,
                    'option_text' => $optionText
                ]);
            }
        }

        return response()->json($post->load(['user', 'pollOptions']), 201);
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

    /**
     * التصويت على استطلاع
     */
    public function vote(Request $request, $postId)
    {
        $request->validate([
            'poll_option_id' => 'required|exists:poll_options,id',
        ]);

        $post = Post::findOrFail($postId);

        if ($post->type !== 'poll') {
            return response()->json(['message' => 'هذا المنشور ليس استطلاع رأي'], 400);
        }

        $userId = Auth::id();

        // التحقق مما إذا كان المستخدم قد صوت بالفعل
        $existingVote = PollVote::where('user_id', $userId)
            ->where('post_id', $postId)
            ->first();

        if ($existingVote) {
            // تحديث التصويت
            $existingVote->update([
                'poll_option_id' => $request->poll_option_id
            ]);
            $message = 'تم تحديث تصويتك بنجاح';
        } else {
            // تصويت جديد
            PollVote::create([
                'user_id' => $userId,
                'post_id' => $postId,
                'poll_option_id' => $request->poll_option_id
            ]);
            $message = 'تم تسجيل تصويتك بنجاح';
        }

        return response()->json([
            'message' => $message,
            'post' => $post->load(['pollOptions.votes'])
        ]);
    }
}
