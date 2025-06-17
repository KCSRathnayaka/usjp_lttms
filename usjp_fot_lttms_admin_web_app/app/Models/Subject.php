<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'subject_name',
        'subject_code',
        'course_id',
    ];


    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }
}
