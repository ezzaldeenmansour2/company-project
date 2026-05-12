<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /**
     * جلب شهادات المستخدم الحالي
     */
    public function myCertificates()
    {
        $certificates = Certificate::where('user_id', Auth::id())
            ->with('course')
            ->get();
        return response()->json($certificates);
    }

    /**
     * إصدار شهادة جديدة
     */
    public function issue(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $user = Auth::user();
        $courseId = $request->course_id;

        // التحقق مما إذا كانت الشهادة موجودة بالفعل
        $existing = Certificate::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($existing) {
            return response()->json($existing);
        }

        // في تطبيق حقيقي، هنا نتحقق من إتمام الدروس والواجبات
        // حالياً سنصدرها مباشرة لمن أتم الدورة
        $certificate = Certificate::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
            'certificate_hash' => Str::upper(Str::random(12)),
            'file_url' => 'https://elevate-lms.com/certificates/' . Str::random(20) . '.pdf',
            'issued_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم إصدار الشهادة بنجاح تهانينا!',
            'certificate' => $certificate
        ], 201);
    }

    /**
     * التحقق من صحة الشهادة (للعامة)
     */
    public function verify($hash)
    {
        $certificate = Certificate::where('certificate_hash', $hash)
            ->with(['user', 'course'])
            ->firstOrFail();

        return response()->json([
            'valid' => true,
            'student_name' => $certificate->user->name,
            'course_title' => $certificate->course->title,
            'issued_at' => $certificate->issued_at
        ]);
    }
}
