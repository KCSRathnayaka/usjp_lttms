import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { Book, BookOpen, BookOpenCheck, Building, Calendar, Folder, GraduationCap, LayoutGrid, Settings, Target, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems = [
    {
        title: 'Manage',

    },
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Lecturers',
        url: '/manage/lecturers',
        icon: User,
    },
    {
        title: 'Lecture halls',
        url: '/manage/lecture-halls',
        icon: Building,
    },
    {
        title: 'Courses',
        url: '/manage/courses',
        icon: GraduationCap,
    },
    {
        title: 'Specialization Areas',
        url: '/manage/specialization-areas',
        icon: Target,
    },
    {
        title: 'Subjects',
        url: '/manage/subjects',
        icon: BookOpenCheck,
    },

    {
        title: 'TIME TABLE',


    },
    {
        title: 'Time Table',

        icon: Calendar,
    },

];

const footerNavItems = [
    {
        title: 'Settings',
        url: '/settings/profile',
        icon: Settings,
    },

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
