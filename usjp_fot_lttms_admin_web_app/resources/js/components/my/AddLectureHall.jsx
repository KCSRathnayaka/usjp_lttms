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


export default function AddLectureHall({ isOpen, onClose, fetchLectureHalls }) {
    // 1. Initialize React Hook Form
    const form = useForm({
        defaultValues: {

            customer_type: 'retail', // Default to retail
            is_active: true, // Default to active
        },
        mode: 'onBlur', // Validate on blur for better user experience
    });

    // 2. Define your submit handler
    const onSubmit = async (data) => {
        console.log('Form data submitted:', data);

        try {

            const response = await axiosInstance.post('/manage/lecture-halls/create', data);
            if (response.status === 200 || response.status === 201) {

                fetchLectureHalls();
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
                    <DrawerTitle className="text-2xl font-semibold">Add New Lecture hall</DrawerTitle>
                    <DrawerDescription>Fill in the details to add a new lecture hall.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* 3. Wrap your form with shadcn/ui's Form component */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                            {/* Customer Name */}
                            <FormField
                                control={form.control}
                                name="hall_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hall Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., FF-05"
                                                {...field} // Spreads onChange, onBlur, value, name, and ref
                                            />
                                        </FormControl>
                                        <FormMessage /> {/* Displays RHF validation error */}
                                    </FormItem>
                                )}
                                rules={{
                                    required: "Hall name is required.",
                                    minLength: {
                                        value: 3,
                                        message: "Hall name must be at least 3 characters."
                                    }
                                }}
                            />






                        </form>
                    </Form>
                </div>

                <DrawerFooter className="flex-shrink-0 border-t px-6 py-4 bg-background">
                    <div className="flex justify-end gap-2">
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Add Hall</Button>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}