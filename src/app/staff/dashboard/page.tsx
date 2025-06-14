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
  ClipboardList,
  UserCheck,
  BarChart3,
  Calendar,
  Phone,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings // Added Settings icon
} from 'lucide-react';

export default function StaffDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (user?.role !== UserRole.STAFF) {
        router.push('/unauthorized'); // Redirect to unauthorized page
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Render a loading state or null while checking auth to prevent flash of content
  if (isLoading || !user || user.role !== UserRole.STAFF) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p>Loading...</p>
      </div>
    );
  }

  const staffActions = [
    {
      title: 'Appointment Management',
      href: '/staff/appointments',
      icon: ClipboardList,
      description: 'Schedule, modify, and manage patient appointments.',
      stats: '24 appointments today'
    },
    {
      title: 'Patient Registration',
      href: '/staff/patients/register',
      icon: UserCheck,
      description: 'Register new patients and update existing records.',
      stats: '8 registrations pending'
    },
    {
      title: 'Daily Reports',
      href: '/staff/reports',
      icon: BarChart3,
      description: 'Generate and review daily operational reports.',
      stats: 'Today\'s report ready'
    },
    {
      title: 'Call Center',
      href: '/staff/calls',
      icon: Phone,
      description: 'Handle patient calls and appointment requests.',
      stats: '5 calls waiting'
    },
    {
      title: 'Patient Records',
      href: '/staff/patients',
      icon: FileText,
      description: 'Access and manage patient information.',
      stats: '1,089 active patients'
    },
    {
      title: 'Billing Support',
      href: '/staff/billing',
      icon: FileText,
      description: 'Assist patients with billing and insurance matters.',
      stats: '12 pending bills'
    },
    {
      title: 'Account Settings',
      href: '/staff/dashboard/settings',
      icon: Settings,
      description: 'Manage your profile and contact details.',
      stats: 'Edit Profile'
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Welcome Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Welcome, {user?.full_name || user?.email || 'Staff Member'}!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Your operational dashboard for managing appointments and supporting patients.
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
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">24</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Registrations</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">8</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Patients</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">1,089</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Calls in Queue</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">5</p>
                </div>
                <Phone className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Actions Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-200">
            Operational Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffActions.map((action) => (
              <Link href={action.href} key={action.title} passHref>
                <Card className="group hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col cursor-pointer bg-white dark:bg-slate-800 border-0 shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-slate-700 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
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

        {/* Task Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                Today's Priority Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Morning patient check-ins</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Appointment confirmations</span>
                </div>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">In Progress</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Insurance verifications</span>
                </div>
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">Pending</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white justify-start"
              >
                <Link href="/staff/appointments/new">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Appointment
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
              >
                <Link href="/staff/patients/register">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Register New Patient
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
              >
                <Link href="/staff/reports/daily">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Daily Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
