<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * جلب إحصائيات عامة للوحة التحكم
     */
    public function overview()
    {
        $stats = [
            'total_students' => User::where('role', 'student')->count(),
            'total_instructors' => User::where('role', 'instructor')->count(),
            'total_courses' => Course::count(),
            'total_enrollments' => Enrollment::count(),
            'total_revenue' => Course::join('enrollments', 'courses.id', '=', 'enrollments.course_id')->sum('price'),
        ];

        // بيانات النمو لآخر 6 أشهر (للرسوم البيانية)
        $growth = Enrollment::select(
            DB::raw('COUNT(*) as count'),
            DB::raw("DATE_FORMAT(created_at, '%M') as month")
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('created_at', 'asc')
        ->get();

        // النشاط الأخير
        $recent_enrollments = Enrollment::with(['user', 'course'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'growth' => $growth,
            'recent_activity' => $recent_enrollments
        ]);
    }
}
