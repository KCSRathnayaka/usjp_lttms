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
import AddLectureHall from '../../../components/my/AddLectureHall';
const breadcrumbs = [
    {
        title: 'Manage',

    }, {
        title: 'Lecture halls',
        href: '/manage/lecture-halls',
    },
];

export default function Index() {


    const [lectureHalls, setLectureHalls] = useState([]);
    const [isAddLectureHallDrawerOpen, setIsAddLectureHallDrawerOpen] = useState(false);


    const fetchLectureHalls = async () => {
        try {
            const response = await axios.get('/manage/lecture-halls/fetch');
            if (response.status === 200) {
                setLectureHalls(response.data.data);
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchLectureHalls();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lecture Halls" />

            <div className="container mx-auto px-4 py-8">


                {/* --- Lecture halls List Section --- */}
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Lecturer Halls</CardTitle>
                        <Button onClick={() => setIsAddLectureHallDrawerOpen(true)}>
                            Add New Lecture Hall
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {lectureHalls.length === 0 ? (
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
                                <p className="text-lg font-medium mb-2">No lecture halls found.</p>
                                <p>Click "Add New Lecture hall" to get started!</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Hall Name</TableHead>
                                           
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lectureHalls.map((lectureHall, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{lectureHall.hall_name}</TableCell>
                                               
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
            <AddLectureHall
                isOpen={isAddLectureHallDrawerOpen}
                onClose={() => setIsAddLectureHallDrawerOpen(false)}
                fetchLectureHalls={fetchLectureHalls}
            />
        </AppLayout>);
}
