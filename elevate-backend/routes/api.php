<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // مسارات إدارة الدورات
    Route::apiResource('courses', CourseController::class);
    Route::get('categories', [CategoryController::class, 'index']);

    // مسارات الاشتراك في الدورات
    Route::get('/my-courses', [EnrollmentController::class, 'myCourses']);
    Route::post('/courses/{id}/enroll', [EnrollmentController::class, 'enroll']);
    Route::get('/courses/{id}/enrollment-status', [EnrollmentController::class, 'checkStatus']);

    // مسارات الحضور والغياب
    Route::prefix('attendance')->group(function () {
        Route::get('/active/{courseId}', [AttendanceController::class, 'getActiveSession']);
        Route::post('/start', [AttendanceController::class, 'startSession']);
        Route::get('/{sessionId}/qr', [AttendanceController::class, 'generateQR']);
        Route::post('/{sessionId}/mark', [AttendanceController::class, 'markAttendance']);
        Route::post('/{sessionId}/close', [AttendanceController::class, 'closeSession']);
    });

    // مسارات المجتمع (المنشورات والتعليقات)
    Route::get('/courses/{courseId}/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // مسارات التكاليف والواجبات
    Route::get('/courses/{courseId}/assignments', [AssignmentController::class, 'index']);
    Route::post('/assignments', [AssignmentController::class, 'store']);
    Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy']);
    Route::get('/assignments/{id}/submissions', [SubmissionController::class, 'index']);
    Route::post('/submissions', [SubmissionController::class, 'store']);
    Route::post('/submissions/{id}/grade', [SubmissionController::class, 'grade']);

    // مسارات الشهادات
    Route::get('/my-certificates', [CertificateController::class, 'myCertificates']);
    Route::post('/certificates/issue', [CertificateController::class, 'issue']);
    Route::get('/certificates/verify/{hash}', [CertificateController::class, 'verify']);

    // مسارات الملف الشخصي والإعدادات
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    // مسارات إدارة المستخدمين (للمسؤول فقط)
    Route::prefix('admin')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'overview']);
        Route::get('/students', [UserController::class, 'students']);
        Route::get('/instructors', [UserController::class, 'instructors']);
        Route::post('/users/{id}/toggle-block', [UserController::class, 'toggleBlock']);
        Route::post('/users/{id}/reset-device', [UserController::class, 'resetDevice']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
