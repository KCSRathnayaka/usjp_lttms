<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Subject;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SubjectController extends Controller
{
  public function index()
  {

    return Inertia::render('manage/subjects/Index');
  }




  public function create(Request $request)
  {


    $validator = Validator::make($request->all(), [
      'subject_name' => 'required',
      'subject_code' => 'required',
      'course' => 'required',
    ]);


    if ($validator->fails()) {
      return response()->json([
        'status' => false,
        'errors' => $validator->errors()->first(),
      ], 422);
    }




    if (Subject::where('subject_code', $request->subject_code)->exists()) {
      return response()->json([
        'status' => false,
        'message' => "Subject code already exists !",
      ], 422);
    }


    if (Subject::where('subject_name', $request->subject_name)->exists()) {
      return response()->json([
        'status' => false,
        'message' => "Subject name already exists !",
      ], 422);
    }

    if (!Course::find($request->course)) {
      return response()->json([
        'status' => false,
        'message' => "Course not found !",
      ], 422);
    }

    DB::beginTransaction();
    try {

      $subject = Subject::create([
        'subject_name' => $request->subject_name,
        'subject_code' => $request->subject_code,
        'course_id' => $request->course,
      ]);
      DB::commit();

      return response()->json([
        'status' => true,
        'message' => 'Subject created successfully'
      ], 201);
    } catch (Exception $e) {

      DB::rollBack();
      Log::error("Error creating subject: " . $e->getMessage());

      return response()->json([
        'status' => false,
        'message' => 'Something went wrong, please try again'
      ]);
    }
  }

  public function fetch(Request $request)
  {


    return response()->json([
      'status' => true,
      'data' => Subject::with('course')->get()
    ]);
  }
}
