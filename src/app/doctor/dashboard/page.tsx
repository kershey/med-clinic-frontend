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
import { UserRole } from '@/types/user.types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Stethoscope,
  ClipboardList,
  Clock,
  UserCheck,
  FileText,
  TrendingUp,
  Settings // Added Settings icon
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (user?.role !== UserRole.DOCTOR) {
        router.push('/unauthorized'); // Redirect to unauthorized page
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Render a loading state or null while checking auth to prevent flash of content
  if (isLoading || !user || user.role !== UserRole.DOCTOR) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p>Loading...</p>
      </div>
    );
  }

  const doctorActions = [
    {
      title: 'Today\'s Schedule',
      href: '/doctor/schedule',
      icon: Calendar,
      description: 'View your appointments and manage your schedule.',
      stats: '8 appointments today'
    },
    {
      title: 'Patient Records',
      href: '/doctor/patients',
      icon: Users,
      description: 'Access and manage patient medical records.',
      stats: '156 patients'
    },
    {
      title: 'Consultations',
      href: '/doctor/consultations',
      icon: Stethoscope,
      description: 'Conduct virtual consultations and follow-ups.',
      stats: '3 pending'
    },
    {
      title: 'Prescriptions',
      href: '/doctor/prescriptions',
      icon: FileText,
      description: 'Write and manage patient prescriptions.',
      stats: '12 this week'
    },
    {
      title: 'Medical Notes',
      href: '/doctor/notes',
      icon: ClipboardList,
      description: 'Create and review clinical notes and observations.',
      stats: '25 recent notes'
    },
    {
      title: 'Performance',
      href: '/doctor/performance',
      icon: TrendingUp,
      description: 'View your performance metrics and analytics.',
      stats: '95% satisfaction'
    },
    {
      title: 'Account Settings',
      href: '/doctor/dashboard/settings',
      icon: Settings,
      description: 'Manage your profile, specialization, and other settings.',
      stats: 'Edit Profile'
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Welcome Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Welcome, Dr. {user?.full_name || user?.email || 'Doctor'}!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Your professional dashboard for managing appointments and patient care.
              {user?.doctor_specifics?.specialization && (
                <span className="block mt-1">
                  Specialization: <strong>{user.doctor_specifics.specialization}</strong>
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Today's Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today's Appointments</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">8</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Patients</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">156</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Consultations</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">3</p>
                </div>
                <Stethoscope className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Availability</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {user?.doctor_specifics?.availability_status || 'Available'}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doctor Actions Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-200">
            Professional Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorActions.map((action) => (
              <Link href={action.href} key={action.title} passHref>
                <Card className="group hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col cursor-pointer bg-white dark:bg-slate-800 border-0 shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-slate-700 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {action.description}
                    </p>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {action.stats}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Schedule View */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-20 h-20 mx-auto mb-4">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <p className="text-lg font-medium mb-2">Your next appointment is in 2 hours.</p>
              <p className="text-sm">
                10:00 AM - John Smith (Follow-up consultation)
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8"
              >
                <Link href="/doctor/schedule">View Full Schedule</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
