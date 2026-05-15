<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use App\Models\ModerationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumModerationController extends Controller
{
    /**
     * דÓÍ ÊÚבםÞ זÍÝÙ ÓÌב ÇבדÑÇÌÚÉ (Soft Delete)
     */
    public function deleteComment(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $comment = Comment::findOrFail($id);
        $admin = Auth::user();

        // 1. Soft Delete the comment
        $comment->delete();

        // 2. Log the action
        ModerationLog::create([
            'admin_id' => $admin->id,
            'action' => 'delete_comment',
            'entity_type' => 'App\Models\Comment',
            'entity_id' => $comment->id,
            'reason' => $request->reason
        ]);

        return response()->json(['message' => 'Êד ÍÐÝ ÇבÊÚבםÞ זÊÓÌםב ÇבÅÌÑÇÁ.']);
    }

    /**
     * ÍÙÑ ØÇבÈ דה ÇבדÔÇÑ‗É Ýם ÇבדהÊÏל
     */
    public function banUser(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $userToBan = User::findOrFail($id);
        $admin = Auth::user();

        // 1. Ban the user
        $userToBan->update(['is_banned_from_forum' => true]);

        // 2. Log the action
        ModerationLog::create([
            'admin_id' => $admin->id,
            'action' => 'ban_from_forum',
            'entity_type' => 'App\Models\User',
            'entity_id' => $userToBan->id,
            'reason' => $request->reason
        ]);

        return response()->json(['message' => 'Êד ÍÙÑ ÇבדÓÊÎÏד דה ÇבÊÝÇÚב ÈÇבדהÊÏל.']);
    }
}
