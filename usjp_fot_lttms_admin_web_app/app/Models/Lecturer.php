<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    protected $fillable = [
        'lecturer_name',
        'email',
        'mobile',
        'is_active',
    ];
}
