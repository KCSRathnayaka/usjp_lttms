<?php

namespace App\Http\Controllers;

use App\Models\LectureTime;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TimeTableController extends Controller
{
    public function index()
    {
        return Inertia::render('manage/time_tables/Index');
    }



    public function modify($semester, $course)
    {
        return Inertia::render('manage/time_tables/Modify');
    }


    public function create(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'semester' => 'required',
            'course' => 'required',
            'lecturer' => 'required',
            'lecture_hall' => 'required',
            'subject' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'day' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()->first(),
            ], 422);
        }


        DB::beginTransaction();
        try {

            $lecture_time = new LectureTime();
            $lecture_time->semester = $request->semester;
            $lecture_time->course_id = $request->course;
            $lecture_time->lecturer_id = $request->lecturer;
            $lecture_time->lecture_hall_id = $request->lecture_hall;
            $lecture_time->subject_id = $request->subject;
            $lecture_time->day = $request->day;
            $lecture_time->start_time = $request->start_time;
            $lecture_time->end_time = $request->end_time;
            $lecture_time->specialization_area_id = $request->specialization_area;
            $lecture_time->save();


            DB::commit();


            return response()->json([
                'status' => true,
                'message' => "New lecture time created successfully",
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error("Error creating time table: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'errors' => "Server error, please try again",
            ], 500);
        }
    }



    public function fetch(Request $request)
    {


        $semester = $request->semester ?? null;
        $course = $request->course ?? null;
        $specialization_area = $request->specialization_area ?? null;


        $query = LectureTime::with('course')->with('subject')->with('lecturer')->with('lectureHall')->with('specializationArea');
        if ($semester) {
            $query->where('semester', $semester);
        }
        if ($course) {
            $query->where('course_id', $course);
        }
        if ($specialization_area) {
            $query->where('specialization_area_id', $specialization_area);
        }
        $time_table = $query->get();

        return response()->json([
            'status' => true,
            'data' => $time_table,
        ], 200);
    }



    public function fetch_current_for_mobile_app(Request $request)
    {


        $semester = $request->semester ?? null;
        $course = $request->course ?? null;
        $specialization_area = $request->specialization_area ?? null;
        $day = $request->day ?? null;

        $validator = Validator::make($request->all(), [
            'semester' => 'nullable',
            'course' => 'nullable',
            'specialization_area' => 'nullable',
            'day' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => "Some parameters are missing",
            ], 422);
        }
        $dayNumber = $this->getDayNumber($day);
        $currentTime = Carbon::now()->format('H:i:s'); // e.g., "14:30:00"

        $query = LectureTime::with('course')->with('subject')->with('lecturer')->with('lectureHall')->with('specializationArea')->where('semester', $semester)->where('course_id', $course)->where('day', $dayNumber)->whereTime('start_time', '<=', $currentTime)->whereTime('end_time', '>=', $currentTime);

        if ($specialization_area) {
            $query->where('specialization_area_id', $specialization_area);
        }
        $time_table = $query->first();

        return response()->json([
            'status' => true,
            'data' => $time_table,
        ], 200);
    }



    public function fetch_upcomming_for_mobile_app(Request $request)
    {


        $semester = $request->semester ?? null;
        $course = $request->course ?? null;
        $specialization_area = $request->specialization_area ?? null;
        $day = $request->day ?? null;

        $validator = Validator::make($request->all(), [
            'semester' => 'nullable',
            'course' => 'nullable',
            'specialization_area' => 'nullable',
            'day' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => "Some parameters are missing",
            ], 422);
        }


        $currentTime = Carbon::now()->format('H:i:s'); // e.g., "14:30:00"
        $dayNumber = $this->getDayNumber($day);
        $query = LectureTime::with('course')->with('subject')->with('lecturer')->with('lectureHall')->with('specializationArea')->where('semester', $semester)->where('course_id', $course)->where('day', $dayNumber)->whereTime('start_time', '>', $currentTime);

        if ($specialization_area) {
            $query->where('specialization_area_id', $specialization_area);
        }
        $time_table = $query->get();

        return response()->json([
            'status' => true,
            'data' => $time_table,
        ], 200);
    }


    public function fetch_by_days_for_mobile_app(Request $request)
    {


        $semester = $request->semester ?? null;
        $course = $request->course ?? null;
        $specialization_area = $request->specialization_area ?? null;
        $day = $request->day ?? null;

        $validator = Validator::make($request->all(), [
            'semester' => 'nullable',
            'course' => 'nullable',
            'specialization_area' => 'nullable',
            'day' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => "Some parameters are missing",
            ], 422);
        }


        $currentTime = Carbon::now()->format('H:i:s'); // e.g., "14:30:00"
        $dayNumber = $this->getDayNumber($day);
        $query = LectureTime::with('course')->with('subject')->with('lecturer')->with('lectureHall')->with('specializationArea')->where('semester', $semester)->where('course_id', $course)->where('day', $dayNumber);

        if ($specialization_area) {
            $query->where('specialization_area_id', $specialization_area);
        }
        $time_table = $query->get();

        return response()->json([
            'status' => true,
            'data' => $time_table,
        ], 200);
    }



    public function getDayNumber(string $dayName): ?int
    {
        // Convert to a consistent case (e.g., ucfirst or strtolower) for robust comparison
        $dayName = ucfirst(strtolower($dayName)); // "monday" -> "Monday", "MONDAY" -> "Monday"

        switch ($dayName) {
            case 'Monday':
                return 1;
            case 'Tuesday':
                return 2;
            case 'Wednesday':
                return 3;
            case 'Thursday':
                return 4;
            case 'Friday':
                return 5;
            default:
                return null; // Or throw an exception for invalid input
        }
    }
}
