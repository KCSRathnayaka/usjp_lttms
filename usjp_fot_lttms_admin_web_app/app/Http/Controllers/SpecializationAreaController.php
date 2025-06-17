<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\SpecializationArea;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SpecializationAreaController extends Controller
{
    public function index()
    {

        return Inertia::render('manage/specialization_areas/Index');
    }


    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'area_name' => 'required',
            'course' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()->first(),
            ], 422);
        }

        if (SpecializationArea::where('area_name', $request->area_name)->exists()) {
            return response()->json([
                'status' => false,
                'message' => "Specialization area name already exists !",
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

            $specialization_area = new SpecializationArea();
            $specialization_area->area_name = $request->area_name;
            $specialization_area->course_id = $request->course;
            $specialization_area->save();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => "Specialization area created successfully !",
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error creating specialization area: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    public function fetch(Request $request)
    {

        return response()->json([

            'status' => true,
            'data' => SpecializationArea::with('course')->get()
        ], 200);
    }
}
