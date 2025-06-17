<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LecturerController extends Controller
{
    public function index()
    {

        return Inertia::render('manage/lecturer/Index');
    }


    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'lecturer_name' => 'required',
        ]);


        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors()->first(),
            ], 422);
        }


        if(Lecturer::where('lecturer_name', $request->lecturer_name)->exists()) {
            return response()->json([
                'status' => false,
                'message' => "Lecturer name already exists !",
            ], 422);
        }

        if($request->email && Lecturer::where('email', $request->email)->exists()) {
            return response()->json([
                'status' => false,
                'message' => "Email already exists !",
            ], 422);
        }

        if($request->mobile && Lecturer::where('mobile', $request->mobile)->exists()) {
            return response()->json([
                'status' => false,
                'message' => "Mobile number already exists !",
            ], 422);
        }


        DB::beginTransaction();

        try {


            $lecturer = new Lecturer();
            $lecturer->lecturer_name = $request->lecturer_name;
            $lecturer->email = $request->email;
            $lecturer->mobile = $request->mobile;
            $lecturer->is_active = $request->is_active;
            $lecturer->save();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Lecturer created successfully'
            ], 201);
        } catch (Exception $e) {

            DB::rollBack();
            Log::error("Error occurred while creating lecturer: " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Server error occured'
            ], 500);
        }
    }


    public function fetch(Request $request){


        return response()->json([

            'status' => true,
            'data' => Lecturer::all()
        ]);

    }
}
