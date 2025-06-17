<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'course_name',
        'course_code',
        'specialization_selection_year',
    ];


    public function specialization_areas()
    {
        return $this->hasMany(SpecializationArea::class, 'course_id', 'id');
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class, 'course_id', 'id');
    }
}
