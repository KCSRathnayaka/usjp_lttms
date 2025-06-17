import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For dashboard cards
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance';
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
import { useForm } from 'react-hook-form';
import AddNewLecture from '../../../components/my/AddNewlecture';
const breadcrumbs = [

    {
        title: 'Manage',

    }, {
        title: 'Timetables',
        href: '/manage/timetables',
    },
    , {
        title: 'Modify',
    },
];



export default function Modify({ semester, course, specialization_area }) {

    const form = useForm({
        defaultValues: {


        },
        mode: 'onBlur', // Validate on blur for better user experience
    });

    const [courses, setCourses] = useState([]);
    const [isAddLectureDraweOpen, setIsAddLectureDraweOpen] = useState(false);


    const fetchcourses = async () => {
        try {
            const response = await axiosInstance.get('/manage/courses/fetch');
            if (response.status === 200) {
                setCourses(response.data.data);
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchcourses();
    }, []);


    const [specializationAreas, setSpecializationAreas] = useState([]);
    const fetchSpecializationAreas = async () => {
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
        fetchLecturers();
        fetchLectureHalls();

    }, []);



    const [lectureHalls, setLectureHalls] = useState([]);


    const fetchLectureHalls = async () => {
        try {
            const response = await axios.get('/manage/lecture-halls/fetch');
            if (response.status === 200) {
                setLectureHalls(response.data.data);
            }
        } catch (error) {

        }
    };
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



    const [lecturers, setLecturers] = useState([]);


    const fetchLecturers = async () => {
        try {
            const response = await axiosInstance.get('/manage/lecturers/fetch');

            if (response.status === 200) {
                setLecturers(response.data.data);
            }

        } catch (error) {



        }
    };


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

    const selectDay = (day) => {
        switch (day) {
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            default:
                return "Unknown day";
        }
    };


    useEffect(() => {

        fetchData();
    }, [selectedSemester, selectedCourse, selectedSpecializationArea])


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />

            <div className="container mx-auto px-4 py-8">


                {/* --- Lecturer List Section --- */}
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
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
                                                        <SelectValue placeholder="Semester" />
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
                                                        <SelectValue placeholder="Course" />
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
                                                    onValueChange={(value) => { field.onChange(value); setSelectedSpecializationArea(specializationAreas.find(area => area.id == value)) }} // Correctly updates RHF's value
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Specialization area" />
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
                                        rules={{ required: "Specialization area is required." }}
                                    />

                                }



                            </Form>
                        </div>
                        <Button onClick={() => setIsAddLectureDraweOpen(true)}>
                            Add New Lecture time
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {timetables.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-12 w-12 mb-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 18.72a48.71 48.71 0 0 0-12.564-.34M12 12.75a3 3 0 0 0 7.464 2.336 48.3 48.3 0 0 0-7.464-2.336Zm-3.136 0A48.691 48.691 0 0 1 12 5.25c2.443 0 4.814.545 7 1.636M12 12.75a3 3 0 0 1-7.464 2.336 48.3 48.3 0 0 1 7.464-2.336Zm0 0V.75"
                                    />
                                </svg>
                                <p className="text-lg font-medium mb-2">No courses found.</p>
                                <p>Click "Add New Course" to get started!</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Semester</TableHead>
                                            <TableHead>Course Code</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Specialization Area</TableHead>
                                            <TableHead>Lecturer</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Day</TableHead>
                                            <TableHead>Start</TableHead>
                                            <TableHead>End</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {timetables.map((t, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{t.semester}</TableCell>
                                                <TableCell className="font-medium">{t.course.course_code}</TableCell>
                                                <TableCell>{t.subject.subject_name ?? '-'}</TableCell>
                                                <TableCell>{t?.specialization_area?.area_name ?? '-'}</TableCell>
                                                <TableCell>{t?.lecturer?.lecturer_name ?? '-'}</TableCell>
                                                <TableCell>{t?.lecture_hall?.hall_name ?? '-'}</TableCell>
                                                <TableCell>{selectDay(t.day)}</TableCell>
                                                <TableCell>{t?.start_time ?? '-'}</TableCell>
                                                <TableCell>{t?.end_time ?? '-'}</TableCell>


                                                <TableCell className="text-right">
                                                    {/*action buttons here*/}
                                                    <Button variant="ghost" size="sm" className="mr-2">Edit</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Lecturer Drawer */}
            <AddNewLecture
                isOpen={isAddLectureDraweOpen}
                onClose={() => setIsAddLectureDraweOpen(false)}
                fetchData={fetchData}
                courses={courses}
                semesters={semsters}
                selectedSemester={selectedSemester}
                setSelectedSemester={setSelectedSemester}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                lecturers={lecturers}
                lectureHalls={lectureHalls}
                specializationAreas={specializationAreas}
                setSelectedSpecializationArea={setSelectedSpecializationArea}
                selectedSpecializationArea={selectedSpecializationArea}
            />
        </AppLayout>);
}
