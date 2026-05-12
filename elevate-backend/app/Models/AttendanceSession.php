<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'instructor_id',
        'status', // waiting, active, closed
        'current_student_id', // Atomic Locking for sequential queue
        'started_at',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function currentStudent()
    {
        return $this->belongsTo(User::class, 'current_student_id');
    }

    public function records()
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}
