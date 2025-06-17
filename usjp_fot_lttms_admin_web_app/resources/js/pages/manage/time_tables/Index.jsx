import React, { useState, useEffect, useMemo } from 'react';
// Assuming shadcn/ui components are available via your project setup
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import './index.css';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
// We'll simulate these imports, as they are part of your specific setup
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
// import AddSubject from '../../../components/my/AddSubject';
// import axios from 'axios';

// --- react-big-calendar Imports ---
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
// Required for Day.js to handle startOf('week') correctly based on locale (e.g., Monday as start)
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Default styles for react-big-calendar
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axiosInstance';

dayjs.extend(weekOfYear); // Extend dayjs with weekOfYear plugin

// Initialize the Day.js localizer
const localizer = dayjsLocalizer(dayjs);

// --- MOCK DATA FOR TIMETABLE ---
// Note: `start_time` and `end_time` are strings (e.g., '09:00:00'), `day` is 'Monday', 'Tuesday' etc.
const MOCK_TIMETABLE_DATA = [
    { id: 'l1', day: 'Monday', start_time: '09:00:00', end_time: '10:00:00', title: 'Software Engineering', lecturer: 'Dr. A. Perera', venue: 'Lab 1', color: 'blue' },
    { id: 'l2', day: 'Monday', start_time: '10:15:00', end_time: '12:00:00', title: 'Data Structures & Algorithms', lecturer: 'Prof. S. Gunawardena', venue: 'LH B', color: 'green' },
    { id: 'l3', day: 'Tuesday', start_time: '10:00:00', end_time: '11:30:00', title: 'Operating Systems', lecturer: 'Ms. K. Dias', venue: 'LH A', color: 'yellow' },
    { id: 'l4', day: 'Tuesday', start_time: '14:00:00', end_time: '15:15:00', title: 'Database Management', lecturer: 'Dr. C. Silva', venue: 'Lab 2', color: 'purple' },
    { id: 'l5', day: 'Wednesday', start_time: '09:00:00', end_time: '10:45:00', title: 'Computer Networks', lecturer: 'Mr. N. Fernando', venue: 'LH C', color: 'red' },
    { id: 'l6', day: 'Wednesday', start_time: '13:45:00', end_time: '14:45:00', title: 'Artificial Intelligence', lecturer: 'Dr. M. Samaraweera', venue: 'Lab 3', color: 'indigo' },
    { id: 'l7', day: 'Thursday', start_time: '10:30:00', end_time: '12:00:00', title: 'Mobile App Dev', lecturer: 'Dr. P. Siriwardana', venue: 'LH D', color: 'pink' },
    { id: 'l8', day: 'Friday', start_time: '09:00:00', end_time: '10:00:00', title: 'Cloud Computing', lecturer: 'Prof. J. Silva', venue: 'LH E', color: 'teal' },
    { id: 'l9', day: 'Friday', start_time: '15:00:00', end_time: '16:00:00', title: 'Cyber Security', lecturer: 'Mr. L. Pathirana', venue: 'Lab 4', color: 'orange' },
    // Example of a lecture spanning multiple hours
    { id: 'l10', day: 'Monday', start_time: '13:00:00', end_time: '14:30:00', title: 'Web Technologies', lecturer: 'Ms. S. Gamage', venue: 'LH B', color: 'blue' },
    { id: 'l11', day: 'Thursday', start_time: '13:00:00', end_time: '15:00:00', title: 'Advanced Algorithms Lab', lecturer: 'Dr. Z. Khan', venue: 'Lab 5', color: 'gray' },
];

const breadcrumbs = [

    {
        title: 'Manage',

    }, {
        title: 'Timetable',
        href: '/manage/timetables',
    },
];

export default function Index() {
    const [events, setEvents] = useState([]);
    const [isAddSubjectDrawerOpen, setIsAddSubjectDrawerOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date()); // State for the calendar's current date

    // Helper to get day index from day name
    const getDayIndex = (dayName) => {
        return [0, 1, 2, 3, 4, 5, 6].indexOf(dayName);
    };




   



    // Custom Event Component for react-big-calendar
    const CustomEvent = ({ event }) => (
        <div className={`m-0 p-1 rounded-md text-white font-semibold
                         bg-blue border-${event.color}-800
                          justify-center items-center h-full w-full `}
            style={{ borderColor: "blue" }}> {/* Dynamic border color */}
            <div className="font-bold text-xs leading-tight text-center">{event.subject.subject_name}</div>
            {/* Display exact times only if needed, react-big-calendar already shows duration */}
            {/* <span className="text-xs mt-1">{dayjs(event.start).format('h:mm A')} - {dayjs(event.end).format('h:mm A')}</span> */}
        </div>
    );

    const { components, views, defaultDate } = useMemo(
        () => ({
            components: {
                event: CustomEvent, // Use our custom event component
                // You can also customize toolbar, header, etc.
            },
            views: {
                week: true,
                day: true,
                // Optionally, include 'month', 'agenda', 'work_week'
            },
            defaultDate: currentDate,
        }),
        [currentDate]
    );
    const form = useForm({
        defaultValues: {


        },
        mode: 'onBlur', // Validate on blur for better user experience
    });

    const [courses, setCourses] = useState([]);
    const [specializationAreas, setSpecializationAreas] = useState([]);

    const fetchcourses = async () => {
        try {
            const response = await axiosInstance.get('/manage/courses/fetch');
            if (response.status === 200) {
                setCourses(response.data.data);
            }
        } catch (error) {

        }
    }; const fetchSpecializationAreas = async () => {
        try {
            const response = await axiosInstance.get('/manage/specialization-areas/fetch');
            if (response.status === 200) {
                setSpecializationAreas(response.data.data);
            }
        } catch (error) {

        } 
    };

    useEffect(() => {
        fetchcourses();
        fetchSpecializationAreas();
    }, []);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSpecializationArea, setSelectedSpecializationArea] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);

    const semsters = ['1', '2', '3', '4', '5', '6', '7', '8'];
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


        // console.log(selectedCourse, selectedSemester)
    }, [selectedCourse, selectedSemester])



    const [timetables, setTimetables] = useState([]);


    const fetchData = async () => {

        try {


            const response = await axiosInstance.get('/manage/timetables/fetch', {
                params: {
                    course: selectedCourse ? selectedCourse.id : null,
                    specialization_area: selectedSpecializationArea ? selectedSpecializationArea.id : null,
                    semester: selectedSemester ? selectedSemester : null,
                }
            });

            if (response.status === 200) {
                console.log(response.data.data);
                setTimetables(response.data.data);
            }
            


        } catch (error) {


        }


    }


    useEffect(() => {

        fetchData();
    }, [selectedSemester, selectedCourse, selectedSpecializationArea])
useEffect(() => {

    // Calculate the Monday of the current week based on `currentDate`
        const startOfWeek = dayjs(currentDate).startOf('week').add(1, 'day'); // Monday of the current week

        // Transform MOCK_TIMETABLE_DATA to react-big-calendar's event format (Date objects)
        const transformedEvents = timetables.map(lecture => {
            const dayIndex = getDayIndex(lecture.day);
            if (dayIndex === -1) return null; // Skip if day name is invalid

            // Get the specific date for the lecture's day within the current week
            const lectureDate = startOfWeek.day(dayIndex);

            // Combine date with time
            const startDateTime = dayjs(`${lectureDate.format('YYYY-MM-DD')}T${lecture.start_time}`).toDate();
            const endDateTime = dayjs(`${lectureDate.format('YYYY-MM-DD')}T${lecture.end_time}`).toDate();

            return {
                ...lecture,
                start: startDateTime,
                end: endDateTime,
            };
        }).filter(Boolean); // Filter out any null entries from invalid day names

        setEvents(transformedEvents);

},[timetables]);
        
    




    return (
        // AppLayout and Head are assumed to be handled by your Laravel/Inertia.js setup
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Timetable" />
            <div className="container mx-auto px-1 py-1 bg-gray-50 min-h-screen">
                <Card className="shadow-2xl rounded-xl overflow-hidden border-2 border-blue-200">
                    <div className='flex flex-row gap-4 px-4 justify-between items-center'>


                        <div className='flex flex-row gap-4'>
                            <Form {...form}>

                                <FormField
                                    control={form.control}
                                    name="semester"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Semester</FormLabel>
                                            <Select
                                                onValueChange={(value) => { setSelectedSemester(value) }} // Correctly updates RHF's value
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select the Semester" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        semsters.map((sem, index) => (
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
                                                onValueChange={(value) => { setSelectedCourse(courses.find(course => course.id == value)) }} // Correctly updates RHF's value
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
                                        name="course"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Specialization Area</FormLabel>
                                                <Select
                                                    onValueChange={(value) => { setSelectedSpecializationArea(specializationAreas.find(area => area.id == value)) }} // Correctly updates RHF's value
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select the Specialization area" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            selectedCourse.specialization_areas.map((area, index) => (
                                                                <SelectItem key={index} value={`${area.id}`}>{area.area_name}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        rules={{ required: "Course is required." }}
                                    />

                                }



                            </Form>
                        </div>
                        <div>
                            <Link href={`/manage/timetables/${selectedSemester}/${selectedCourse?.id}/modify`}>
                                <Button>Modify</Button>
                            </Link>

                        </div>

                    </div>
                    <CardContent className="p-0 h-[700px]"> {/* Set a fixed height for the calendar */}
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start" // Key for event start time
                            endAccessor="end"     // Key for event end time
                            defaultView="week"    // Default to week view
                            views={views}         // Available views (week, day)
                            min={new Date(0, 0, 0, 8, 0, 0)} // Start calendar at 8 AM
                            max={new Date(0, 0, 0, 17, 0, 0)} // End calendar at 5 PM
                            step={60}             // Grid step in minutes
                            timeslots={1}         // Number of slots per step (1 means 1-hour slots here)
                            // Filter out weekend days if you only want Monday-Friday
                            formats={{
                                dayFormat: (date, culture, localizer) =>
                                    localizer.format(date, 'dddd', culture),
                            }}
                            components={components} // Use our custom event component
                            style={{ height: '100%', width: '100%' }} // Fill the CardContent
                            toolbar={false} // Show default toolbar for navigation
                            longPressThreshold={10} // Adjust for faster event creation if needed
                            // Custom styling for events using eventPropGetter
                            eventPropGetter={(event) => {
                                const backgroundColor = event.color ? `var(--${event.color}-600)` : '#3498db'; // Use Tailwind color vars
                                const borderColor = event.color ? `var(--${event.color}-800)` : '#2980b9';
                                return {
                                    style: {
                                        backgroundColor: "blue",
                                        borderColor: borderColor,
                                        color: 'white',
                                        borderRadius: '8px',

                                        padding: '1px',
                                        opacity: 0.9,
                                        cursor: 'pointer',
                                        // You can add more inline styles here
                                    },
                                };
                            }}
                            dayPropGetter={(date) => {
                                // Hide weekend days (Saturday and Sunday)
                                const dayOfWeek = dayjs(date).day(); // 0 for Sunday, 6 for Saturday
                                if (dayOfWeek === 0 || dayOfWeek === 6) {
                                    return {
                                        style: {
                                            backgroundColor: '#f5f5f5', // Lighter background for hidden days
                                            pointerEvents: 'none',     // Disable interaction
                                            opacity: 0.5,             // Make them faded
                                        },
                                        className: 'rbc-off-range-bg' // Class provided by react-big-calendar
                                    };
                                }
                                return {};
                            }}
                            onNavigate={(newDate) => { // Keep track of the current date displayed in the calendar
                                setCurrentDate(newDate);
                            }}
                            date={currentDate} // Controlled date for navigating to specific week/day
                        />
                    </CardContent>
                </Card>

                {/* Placeholder for the AddSubject drawer/modal component */}
                {/*
            <AddSubject
                isOpen={isAddSubjectDrawerOpen}
                onClose={() => setIsAddSubjectDrawerOpen(false)}
                // You might need a prop to trigger a refetch of timetable data after adding a subject
                // onSubjectAdded={fetchTimetableData}
            />
            */}
            </div>
        </AppLayout>
    );
}


