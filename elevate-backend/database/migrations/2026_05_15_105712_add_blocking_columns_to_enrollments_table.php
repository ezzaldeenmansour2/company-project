<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->boolean('is_blocked')->default(false);
            $table->text('block_reason')->nullable();
            $table->string('block_report_path')->nullable();
        });
    }
    public function down(): void {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn(['is_blocked', 'block_reason', 'block_report_path']);
        });
    }
};