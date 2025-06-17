<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lecture_times', function (Blueprint $table) {
            $table->id();
            $table->integer('semester');
            $table->unsignedBigInteger('course_id');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->unsignedBigInteger('lecturer_id');
            $table->foreign('lecturer_id')->references('id')->on('lecturers')->onDelete('cascade');
            $table->unsignedBigInteger('lecture_hall_id');
            $table->foreign('lecture_hall_id')->references('id')->on('lecture_halls')->onDelete('cascade');
            $table->unsignedBigInteger('subject_id');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
            $table->unsignedBigInteger('specialization_area_id')->nullable();
            $table->foreign('specialization_area_id')->references('id')->on('specialization_areas')->onDelete('cascade');
            $table->integer('day');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lecture_times');
    }
};
