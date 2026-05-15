<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModerationLog extends Model
{
    protected  = ['admin_id', 'action', 'entity_type', 'entity_id', 'reason'];
}
