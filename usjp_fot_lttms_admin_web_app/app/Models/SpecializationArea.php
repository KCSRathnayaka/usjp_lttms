<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecializationArea extends Model
{
    protected $fillable = [
        'area_name',
        'course_id'
    ];


    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }
}
