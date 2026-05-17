<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $fillable = ['course_id', 'user_id', 'percentage', 'starts_at', 'ends_at'];
}
