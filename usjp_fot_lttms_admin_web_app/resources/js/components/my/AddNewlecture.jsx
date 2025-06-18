import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; // Import useForm hook

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Import shadcn/ui Form components for seamless integration
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';



export default function AddNewLecture({ isOpen, onClose, fetchData, courses, semesters, setSelectedSemester, selectedSemester, selectedCourse, setSelectedCourse, lecturers, lectureHalls,specializationAreas,setSelectedSpecializationArea,selectedSpecializationArea }) {
    // 1. Initialize React Hook Form
    const form = useForm({
        defaultValues: {


        },
        mode: 'onBlur', // Validate on blur for better user experience
    });

    // 2. Define your submit handler
    const onSubmit = async (data) => {
        

        try {

            const response = await axiosInstance.post('/manage/timetables/create', {
                semester: data.semester,
                course: data.course,
                lecturer: data.lecturer,
                day: data.day,
                start_time: data.start,
                end_time: data.end,
                lecture_hall: data.hall,
                subject: data.subject,
                specialization_area:selectedSpecializationArea?.id ?? null
            });
            console.log(response);
            if (response.status === 200 || response.status === 201) {


                fetchData();
                onClose(); // Close the drawer after submission
                form.reset(); // Reset form fields using React Hook Form's reset method




            }


        } catch (error) {


        }

    };

    const [specializaionShow, setSpecializaionShow] = useState(false);

    useEffect(() => {

        if (selectedCourse === null) return;

        if (selectedSemester === null) return;


        if (Number(selectedCourse.specialization_selection_year) * 2 <= Number(selectedSemester)) {
            // console.log('true');
            setSpecializaionShow(true);
        } else {
            setSelectedSpecializationArea(null);
            //console.log('false');
            setSpecializaionShow(false);
        }

        setSelectedSpecializationArea(null);

        // console.log(selectedCourse, selectedSemester)
    }, [selectedCourse, selectedSemester])


    const [days, setDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction="right">
            <DrawerContent className="w-full max-w-md h-full fixed right-0 top-0">
                <DrawerHeader className="border-b px-6 py-4">
                    <DrawerTitle className="text-2xl font-semibold">Add New Lecture Time</DrawerTitle>
                    <DrawerDescription>Fill in the details to add a new lecture time.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">

                            <FormField
                                control={form.control}
                                name="semester"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semester</FormLabel>
                                        <Select
                                            onValueChange={(value) => { field.onChange(value); setSelectedSemester(value) }} // Correctly updates RHF's value
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the Semester" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    semesters.map((sem, index) => (
                                                        <SelectItem key={index} value={`${sem}`}>{sem}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{ required: "Semester is required." }}
                            />
                            <FormField
                                control={form.control}
                                name="course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course</FormLabel>
                                        <Select
                                            onValueChange={(value) => { field.onChange(value); setSelectedCourse(courses.find(course => course.id == value)) }} // Correctly updates RHF's value
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the Course" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    courses.map((course, index) => (
                                                        <SelectItem key={index} value={`${course.id}`}>{course.course_code}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{ required: "Course is required." }}
                            />

   {

                                    specializaionShow && <FormField
                                        control={form.control}
                                        name="specialization_area"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Specialization Area</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {field.onChange(value); setSelectedSpecializationArea(specializationAreas.find(area => area.id == value)) }} // Correctly updates RHF's value
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select the Specialization area" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            selectedCourse?.specialization_areas.map((area, index) => (
                                                                <SelectItem key={index} value={`${area.id}`}>{area.area_name}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                       
                                    />

                                }
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <Select
                                            onValueChange={field.onChange} // Correctly updates RHF's value
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the Course" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    selectedCourse?.subjects?.map((subject, index) => (
                                                        <SelectItem key={index} value={`${subject.id}`}>{subject.subject_name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{ required: "Subject is required." }}
                            />

                            <FormField
                                control={form.control}
                                name="lecturer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lecturer</FormLabel>
                                        <Select
                                            onValueChange={field.onChange} // Correctly updates RHF's value
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the Lecturer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    lecturers.map((lecturer, index) => (
                                                        <SelectItem key={index} value={`${lecturer.id}`}>{lecturer.lecturer_name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{ required: "Lecturer is required." }}
                            />

                            <FormField
                                control={form.control}
                                name="hall"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lecture hall</FormLabel>
                                        <Select
                                            onValueChange={field.onChange} // Correctly updates RHF's value
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the Lecture hall" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    lectureHalls.map((hall, index) => (
                                                        <SelectItem key={index} value={`${hall.id}`}>{hall.hall_name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{ required: "Lecture hall is required." }}
                            />


                            <FormField
                                control={form.control}
                                name="day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lecture Day</FormLabel>
                                        <Select
                                            onValueChange={field.onChange} // Correctly updates RHF's value
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the Lecture day" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    days.map((day, index) => (
                                                        <SelectItem key={index} value={`${index+1}`}>{day}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{ required: "Day is required." }}
                            />

                            <div className='flex flex-row justify-between'>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="start"

                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <input type="time" name="" id="" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        rules={{ required: "Start time is required." }}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="end"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End time</FormLabel>
                                                <input type="time" name="" id="" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        rules={{ required: "End time is required." }}
                                    />
                                </div>

                            </div>




                        </form>
                    </Form>
                </div>

                <DrawerFooter className="flex-shrink-0 border-t px-6 py-4 bg-background">
                    <div className="flex justify-end gap-2">
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Add Lecture Time</Button>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}