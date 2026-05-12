<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'content_type',
        'content_body',
        'order',
        'is_hidden',
        'scheduled_at',
    ];

    protected $casts = [
        'is_hidden' => 'boolean',
        'scheduled_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
