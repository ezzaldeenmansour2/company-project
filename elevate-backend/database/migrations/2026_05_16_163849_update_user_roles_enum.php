<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First update existing 'admin' roles to 'super_admin'
        DB::table('users')->where('role', 'admin')->update(['role' => 'super_admin']);

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['super_admin', 'academic_admin', 'instructor', 'student'])->default('student')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'instructor', 'student'])->default('student')->change();
        });
    }
};
