'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarPlus,
  ListChecks,
  FileTextIcon,
  UserCog,
  LogOut,
  BriefcaseMedical, // For "Medical Records"
  Settings2, // For "Manage Profile"
  NotebookPen, // For "My Appointments"
  PlusCircle, // For "Book New Appointment"
} from 'lucide-react';

export default function PatientDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      // Only redirect to login if user directly accessed this page without authentication
      // Avoid redirecting during logout process
      const currentPath = window.location.pathname;
      if (currentPath === '/patient/dashboard') {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  const quickActions = [
    {
      title: 'Book New Appointment',
      href: '/appointments/book', // Placeholder, adjust as needed
      icon: PlusCircle,
      description: 'Find a doctor and schedule your next visit.',
    },
    {
      title: 'My Appointments',
      href: '/patient/appointments',
      icon: NotebookPen,
      description: 'View and manage your upcoming and past appointments.',
    },
    {
      title: 'Medical Records',
      href: '/patient/medical-records',
      icon: BriefcaseMedical,
      description: 'Access your health history and test results.',
    },
    {
      title: 'Manage Profile',
      href: '/patient/profile',
      icon: Settings2,
      description: 'Update your personal information and preferences.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Welcome back, {user?.full_name || user?.email || 'Patient'}!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Here's an overview of your patient portal. Manage your health with
              ease.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link href={action.href} key={action.title} passHref>
                <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col cursor-pointer bg-white dark:bg-slate-800">
                  <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                    <action.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl text-slate-700 dark:text-slate-100">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder - Replace with actual appointment list later */}
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <ListChecks className="w-12 h-12 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
              <p>You have no upcoming appointments.</p>
              <p className="text-sm mt-1">
                Book a new appointment to see it listed here.
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                asChild
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Link href="/patient/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Info & Logout Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
            <p>
              <strong>Account Status:</strong> {user?.account_status}
            </p>
          </CardContent>
          <CardFooter className="border-t pt-4 dark:border-slate-700">
            <Button
              onClick={() => logout()}
              variant="outline"
              className="w-full sm:w-auto dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
