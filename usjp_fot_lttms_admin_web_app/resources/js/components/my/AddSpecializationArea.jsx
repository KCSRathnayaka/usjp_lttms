import React from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from '../../utils/axiosInstance';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



export default function AddSpecializationArea({ isOpen, onClose, fetchSpecializationAreas, courses }) {
    // 1. Initialize React Hook Form
    const form = useForm({
        defaultValues: {



        },
        mode: 'onBlur', // Validate on blur for better user experience
    });

    // 2. Define your submit handler
    const onSubmit = async (data) => {
        console.log('Form data submitted:', data);

        try {

            const response = await axiosInstance.post('/manage/specialization-areas/create', data);

            if (response.status === 200 || response.status === 201) {

                console.log("response");
                fetchSpecializationAreas();
                onClose(); // Close the drawer after submission
                form.reset(); // Reset form fields using React Hook Form's reset method




            }


        } catch (error) {


        }

    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction="right">
            <DrawerContent className="w-full max-w-md h-full fixed right-0 top-0">
                <DrawerHeader className="border-b px-6 py-4">
                    <DrawerTitle className="text-2xl font-semibold">Add New Specialization Area</DrawerTitle>
                    <DrawerDescription>Fill in the details to add a new course.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* 3. Wrap your form with shadcn/ui's Form component */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                            {/* Customer Name */}

                            <FormField
                                control={form.control}
                                name="area_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specialization Area name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Software technology"
                                                {...field} // Spreads onChange, onBlur, value, name, and ref
                                            />
                                        </FormControl>
                                        <FormMessage /> {/* Displays RHF validation error */}
                                    </FormItem>
                                )}
                                rules={{
                                    required: "Course  code is required.",
                                    minLength: {
                                        value: 3,
                                        message: "Course code must be at least 3 characters."
                                    }
                                }}
                            />


                            <FormField
                                control={form.control}
                                name="course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course</FormLabel>
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
                                                    courses.map((course, index) => (
                                                        <SelectItem key={index} value={`${course.id}`}>{course.course_code}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{ required: "Specialization selection year is required." }}
                            />
                        </form>
                    </Form>
                </div>

                <DrawerFooter className="flex-shrink-0 border-t px-6 py-4 bg-background">
                    <div className="flex justify-end gap-2">
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Add Specialization Area</Button>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}