<?php

namespace App\Http\Controllers;

use App\Models\PrerequisiteException;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrerequisiteController extends Controller
{
    /**
     * ÿ·» «” À‰«¡ (··ÿ«·»)
     */
    public function requestExemption(Request $request, $courseId)
    {
        $request->validate([
            'justification_document' => 'required|file|mimes:pdf,jpg,png,doc,docx|max:5120'
        ]);

        $user = Auth::user();

        // «· Õﬁﬁ „‰ ⁄œ„ ÊÃÊœ ÿ·» „”»ﬁ ﬁÌœ «·«‰ Ÿ«— √Ê „ﬁ»Ê·
        $existing = PrerequisiteException::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return response()->json(['message' => '·œÌﬂ ÿ·» «” À‰«¡ „”»ﬁ ·Â–Â «·œÊ—….'], 400);
        }

        $path = $request->file('justification_document')->store('exemptions', 'public');

        $exemption = PrerequisiteException::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
            'justification_document_path' => $path,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => ' „ ≈—”«· ÿ·» «·«” À‰«¡ »‰Ã«Õ ÊÊÀÌﬁ… «· »—Ì— ﬁÌœ «·„—«Ã⁄….',
            'exemption' => $exemption
        ], 201);
    }

    /**
     * ﬁ»Ê· «·«” À‰«¡ (≈œ«—…)
     */
    public function approveExemption($id)
    {
        $exemption = PrerequisiteException::findOrFail($id);
        $exemption->update(['status' => 'approved']);

        return response()->json(['message' => ' „ ﬁ»Ê· «·«” À‰«¡ »‰Ã«Õ.']);
    }

    /**
     * —›÷ «·«” À‰«¡ (≈œ«—…)
     */
    public function rejectExemption($id)
    {
        $exemption = PrerequisiteException::findOrFail($id);
        $exemption->update(['status' => 'rejected']);

        return response()->json(['message' => ' „ —›÷ «·«” À‰«¡.']);
    }
}
