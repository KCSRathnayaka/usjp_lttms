<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeTableController extends Controller
{
    public function index(){
        return Inertia::render('manage/time_tables/Index');
    }
}
