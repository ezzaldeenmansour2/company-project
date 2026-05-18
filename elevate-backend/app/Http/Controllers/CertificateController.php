<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

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
     * إصدار شهادة جديدة (بعد التحقق من إتمام الدورة)
     */
    public function issue(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $user     = Auth::user();
        $courseId = $request->course_id;

        // 1. التحقق من أن الطالب مسجل في الدورة
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (! $enrollment) {
            return response()->json(['message' => 'أنت غير مسجل في هذه الدورة.'], 403);
        }

        // 2. إذا كانت الشهادة موجودة بالفعل — أرجعها مباشرة
        $existing = Certificate::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($existing) {
            return response()->json($existing);
        }

        // 3. توليد hash فريد للشهادة
        $hash = strtoupper(Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4));

        // 4. حفظ مسار PDF
        $fileName = 'cert_' . $user->id . '_' . $courseId . '_' . time() . '.pdf';
        $filePath = 'certificates/' . $fileName;

        // 5. إنشاء سجل الشهادة في قاعدة البيانات
        $certificate = Certificate::create([
            'user_id'          => $user->id,
            'course_id'        => $courseId,
            'certificate_hash' => $hash,
            'file_url'         => $filePath,
            'issued_at'        => now(),
        ]);

        // 6. تحديث حالة الاشتراك إلى "مكتمل"
        $enrollment->update(['status' => 'completed']);

        return response()->json([
            'message'     => 'تم إصدار الشهادة بنجاح! تهانينا 🎉',
            'certificate' => $certificate,
        ], 201);
    }

    /**
     * تحميل الشهادة كـ PDF حقيقي
     */
    public function download($hash)
    {
        $certificate = Certificate::where('certificate_hash', $hash)
            ->with(['user', 'course.instructor'])
            ->firstOrFail();

        // التحقق من أن المستخدم صاحب الشهادة أو مدير
        $user = Auth::user();
        if ($certificate->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'غير مصرح لك بتحميل هذه الشهادة.'], 403);
        }

        $data = [
            'studentName'     => $certificate->user->name,
            'courseTitle'     => $certificate->course->title,
            'instructorName'  => $certificate->course->instructor->name ?? 'Elevate Team',
            'certificateHash' => $certificate->certificate_hash,
            'issuedAt'        => \Carbon\Carbon::parse($certificate->issued_at)->format('d / m / Y'),
        ];

        $pdf = Pdf::loadView('certificate', $data)
            ->setPaper([0, 0, 841.89, 595.28], 'landscape'); // A4 landscape

        return $pdf->download('elevate-certificate-' . $hash . '.pdf');
    }

    /**
     * التحقق من صحة الشهادة (للعامة — بدون توثيق)
     */
    public function verify($hash)
    {
        $certificate = Certificate::where('certificate_hash', $hash)
            ->with(['user', 'course'])
            ->firstOrFail();

        return response()->json([
            'valid'        => true,
            'student_name' => $certificate->user->name,
            'course_title' => $certificate->course->title,
            'issued_at'    => $certificate->issued_at,
            'hash'         => $certificate->certificate_hash,
        ]);
    }
}
