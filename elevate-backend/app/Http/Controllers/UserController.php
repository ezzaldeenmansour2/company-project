<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * جلب قائمة الطلاب
     */
    public function students()
    {
        $students = User::where('role', 'student')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($students);
    }

    /**
     * جلب قائمة المدربين
     */
    public function instructors()
    {
        $instructors = User::where('role', 'instructor')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($instructors);
    }

    /**
     * حظر أو إلغاء حظر مستخدم
     */
    public function toggleBlock($id)
    {
        $user = User::findOrFail($id);
        $user->is_blocked = !$user->is_blocked;
        $user->save();

        $status = $user->is_blocked ? 'محظور' : 'مفعل';
        return response()->json([
            'message' => "تم تغيير حالة المستخدم إلى $status بنجاح",
            'user' => $user
        ]);
    }

    /**
     * إعادة تعيين ربط الجهاز (Device UUID)
     */
    public function resetDevice($id)
    {
        $user = User::findOrFail($id);
        $user->device_uuid = null;
        $user->save();

        return response()->json([
            'message' => 'تم إعادة تعيين ربط الجهاز بنجاح. يمكن للطالب الآن الدخول من جهاز جديد.',
            'user' => $user
        ]);
    }

    /**
     * حذف مستخدم (اختياري)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'تم حذف المستخدم بنجاح']);
    }
}
