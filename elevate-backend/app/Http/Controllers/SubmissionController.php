<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    /**
     * إرسال حل لتكليف معين (للطالب)
     */
    public function store(Request $request)
    {
        $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'file_url' => 'required|string', // في تطبيق حقيقي سيتم رفع ملف هنا
        ]);

        $submission = Submission::create([
            'assignment_id' => $request->assignment_id,
            'user_id' => Auth::id(),
            'file_url' => $request->file_url,
            'submitted_at' => now(),
        ]);

        return response()->json($submission, 201);
    }

    /**
     * جلب كافة الحلول لتكليف معين (للمدرب)
     */
    public function index($assignmentId)
    {
        $submissions = Submission::where('assignment_id', $assignmentId)
            ->with('user')
            ->get();
        return response()->json($submissions);
    }

    /**
     * وضع درجة وتقييم للحل (للمدرب)
     */
    public function grade(Request $request, $id)
    {
        $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $submission = Submission::findOrFail($id);
        $submission->update([
            'grade' => $request->grade,
            'feedback' => $request->feedback,
        ]);

        return response()->json([
            'message' => 'تم تقييم الحل بنجاح',
            'submission' => $submission
        ]);
    }
}
