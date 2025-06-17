<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\LectureHallController;
use App\Http\Controllers\SpecializationAreaController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TimeTableController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {


    return redirect(route('dashboard', absolute: false));
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {



    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');



    /**Lecturers */
    Route::get('manage/lecturers', [LecturerController::class, 'index'])->name('lecturers.index');
    Route::post('manage/lecturers/create', [LecturerController::class, 'create'])->name('lecturers.create');
    Route::get('manage/lecturers/fetch', [LecturerController::class, 'fetch'])->name('lecturers.fetch');


    Route::get('manage/lecture-halls', [LectureHallController::class, 'index'])->name('lecture-halls.index');
    Route::post('manage/lecture-halls/create', [LectureHallController::class, 'create'])->name('lecture-halls.create');
    Route::get('manage/lecture-halls/fetch', [LectureHallController::class, 'fetch'])->name('lecture-halls.fetch');

    Route::get('manage/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('manage/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::get('manage/courses/fetch', [CourseController::class, 'fetch'])->name('courses.fetch');

    Route::get('manage/subjects', [SubjectController::class, 'index'])->name('subjects.index');
    Route::post('manage/subjects/create', [SubjectController::class, 'create'])->name('subjects.create');
    Route::get('manage/subjects/fetch', [SubjectController::class, 'fetch'])->name('subjects.fetch');

    Route::get('manage/specialization-areas', [SpecializationAreaController::class, 'index'])->name('specialization-areas.index');
    Route::post('manage/specialization-areas/create', [SpecializationAreaController::class, 'create'])->name('specialization-areas.create');
    Route::get('manage/specialization-areas/fetch', [SpecializationAreaController::class, 'fetch'])->name('specialization-areas.fetch');


    Route::get('manage/timetables', [TimeTableController::class, 'index'])->name('timetables.index');
    Route::get('manage/timetables/{semester}/{course}/modify', [TimeTableController::class, 'modify'])->name('timetables.modify');
    Route::post('manage/timetables/create', [TimeTableController::class, 'create'])->name('timetables.create');
    Route::get('manage/timetables/fetch', [TimeTableController::class, 'fetch'])->name('timetables.fetch');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
