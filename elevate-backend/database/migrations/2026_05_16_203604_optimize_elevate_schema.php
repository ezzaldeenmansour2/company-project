<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Adding indexes to high-traffic tables
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->index(['attendance_session_id', 'user_id']);
            $table->index('scanned_at');
            $table->softDeletes();
        });

        Schema::table('attendance_sessions', function (Blueprint $table) {
            $table->index(['course_id', 'status']);
            $table->softDeletes();
        });

        Schema::table('enrollments', function (Blueprint $table) {
            $table->index(['user_id', 'course_id']);
            $table->index('status');
            $table->softDeletes();
        });

        Schema::table('courses', function (Blueprint $table) {
            $table->index('status');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('attendance_sessions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
