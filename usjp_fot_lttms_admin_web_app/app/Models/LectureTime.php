<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LectureTime extends Model
{
    protected $table = 'lecture_times';

    protected $fillable = [
        'semester',
        'course_id',
        'lecturer_id',
        'lecture_hall_id',
        'subject_id',
        'specialization_area_id',
        'day',
        'start_time',
        'end_time',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class);
    }

    public function lectureHall()
    {
        return $this->belongsTo(LectureHall::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function specializationArea()
    {
        return $this->belongsTo(SpecializationArea::class);
    }
}
