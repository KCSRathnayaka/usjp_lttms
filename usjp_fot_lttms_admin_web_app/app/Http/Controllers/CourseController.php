<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {

        return Inertia::render('manage/courses/Index');
    }




    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'course_name' => 'required',
            'course_code' => 'required',
            'specialization_selection_year' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()->first(),
            ], 422);
        }

        if (Course::where('course_code', $request->course_code)->exists()) {
            return response()->json([
                'status' => false,
                'message' => "Course code already exists !",
            ], 422);
        }

        if (Course::where('course_name', $request->course_name)->exists()) {
            return response()->json([
                'status' => false,
                'message' => "Course name already exists !",
            ], 422);
        }


        DB::beginTransaction();

        try {

            $course = Course::create([
                'course_name' => $request->course_name,
                'course_code' => $request->course_code,
                'specialization_selection_year' => $request->specialization_selection_year,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => "Course created successfully !",
            ], 201);
        } catch (Exception $e) {

            DB::rollBack();
            Log::error("Error creating course: " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => "Error creating course !",
            ], 500);
        }
    }



    public function fetch(Request $request)
    {


        return response()->json([
            'status' => true,
            'data' => Course::all()
        ]);
    }
}
