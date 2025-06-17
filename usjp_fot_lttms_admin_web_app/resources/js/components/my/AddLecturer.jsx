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


export default function AddLecturer({ isOpen, onClose, fetchLecturers }) {
    // 1. Initialize React Hook Form
    const form = useForm({
        defaultValues: {
            is_active: true, // Default to active
        },
        mode: 'onBlur', // Validate on blur for better user experience
    });

    // 2. Define your submit handler
    const onSubmit = async (data) => {

        try {

            const response = await axiosInstance.post('/manage/lecturers/create', data);
            if (response.status === 200 || response.status === 201) {

                fetchLecturers();
                onClose(); // Close the drawer after submission
                form.reset(); // Reset form fields using React Hook Form's reset method
            }


        } catch (error) {

            /**Already handled */
        }

    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction="right">
            <DrawerContent className="w-full max-w-md h-full fixed right-0 top-0">
                <DrawerHeader className="border-b px-6 py-4">
                    <DrawerTitle className="text-2xl font-semibold">Add New Lecturer</DrawerTitle>
                    <DrawerDescription>Fill in the details to add a new lecturer.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* 3. Wrap your form with shadcn/ui's Form component */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                            {/* Customer Name */}
                            <FormField
                                control={form.control}
                                name="lecturer_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lecturer Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Prof. Nalaka"
                                                {...field} // Spreads onChange, onBlur, value, name, and ref
                                            />
                                        </FormControl>
                                        <FormMessage /> {/* Displays RHF validation error */}
                                    </FormItem>
                                )}
                                rules={{
                                    required: "Lecturer name is required.",
                                    minLength: {
                                        value: 3,
                                        message: "Lecturer name must be at least 3 characters."
                                    }
                                }}
                            />


                            {/* Mobile Number */}
                            <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="e.g., 0771234567"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{

                                    pattern: {
                                        // Basic Sri Lankan mobile number pattern (starts with 07 and 9 digits total)
                                        value: /^07\d{8}$/,
                                        message: "Invalid mobile number format (e.g., 07XXXXXXXX)."
                                    }
                                }}
                            />


                            {/* E-mail */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="e.g., example@gmail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                rules={{

                                    pattern: {

                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format (e.g., example@gmail.com)."
                                    }


                                }}
                            />


                            {/* Is Active Checkbox */}
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Is Active</FormLabel>
                                            <FormDescription>
                                                Set if the lecturer account is active.
                                            </FormDescription>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>

                <DrawerFooter className="flex-shrink-0 border-t px-6 py-4 bg-background">
                    <div className="flex justify-end gap-2">
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Add Lecturer</Button>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}