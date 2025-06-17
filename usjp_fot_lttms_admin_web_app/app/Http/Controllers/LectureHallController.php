<?php

namespace App\Http\Controllers;

use App\Models\LectureHall;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LectureHallController extends Controller
{
    public function index()
    {

        return Inertia::render('manage/lecture_halls/Index');
    }


    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'hall_name' => 'required',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors()->first(),
            ], 422);
        }


        if(LectureHall::where('hall_name', $request->hall_name)->exists()) {
            return response()->json([
                'status' => false,
                'message' => "Lecture Hall name already exists !",
            ], 422);
        }

        DB::beginTransaction();
        try {

            $lecture_hall = new LectureHall();
            $lecture_hall->hall_name = $request->hall_name;
            $lecture_hall->save();

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => "Lecture Hall created successfully",
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error Creating Lecture Hall: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => "Server Error occured",
            ], 422);
        }
    }



    public function fetch(Request $request)
    {


        return response()->json([

            'status' => true,
            'data' => LectureHall::all()
        ]);
    }
}
