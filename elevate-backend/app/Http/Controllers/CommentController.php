<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * إضافة تعليق على منشور
     */
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string',
        ]);

        if (Auth::user()->is_banned_from_forum) {
            return response()->json(['message' => 'لقد تم حظرك من المشاركة في المنتدى.'], 403);
        }

        $comment = Comment::create([
            'post_id' => $request->post_id,
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    /**
     * حذف تعليق
     */
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        
        if ($comment->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'غير مصرح لك بحذف هذا التعليق'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'تم حذف التعليق بنجاح']);
    }
}
