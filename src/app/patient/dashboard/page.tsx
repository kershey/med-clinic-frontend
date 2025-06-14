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
  ListChecks,
  LogOut,
  BriefcaseMedical,
  Settings2,
  NotebookPen,
  PlusCircle,
} from 'lucide-react';
import { UserRole } from '@/types/user.types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PatientDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (user?.role !== UserRole.PATIENT) {
        router.push('/unauthorized'); // Redirect to unauthorized page
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Render a loading state or null while checking auth to prevent flash of content
  if (isLoading || !user || user.role !== UserRole.PATIENT) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p>Loading...</p>
      </div>
    );
  }

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
      href: '/patient/dashboard/settings',
      icon: Settings2,
      description: 'Update your personal information and preferences.',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Welcome Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Welcome back, {user?.full_name || user?.email || 'Patient'}!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Here's an overview of your patient portal. Manage your health with ease.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-200">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link href={action.href} key={action.title} passHref>
                <Card className="group hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col cursor-pointer bg-white dark:bg-slate-800 border-0 shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-slate-700 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-20 h-20 mx-auto mb-4">
                <ListChecks className="w-12 h-12 text-white" />
              </div>
              <p className="text-lg font-medium mb-2">You have no upcoming appointments.</p>
              <p className="text-sm">
                Book a new appointment to see it listed here.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
              >
                <Link href="/patient/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
