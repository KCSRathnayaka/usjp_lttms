<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\TimeTableController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/courses/fetch',[CourseController::class,'fetch_for_mobile_app']);
Route::get('/timetables/fetch/current',[TimeTableController::class,'fetch_current_for_mobile_app']);
Route::get('/timetables/fetch/upcomming',[TimeTableController::class,'fetch_upcomming_for_mobile_app']);
Route::get('/timetables/fetch/by-days',[TimeTableController::class,'fetch_by_days_for_mobile_app']);

