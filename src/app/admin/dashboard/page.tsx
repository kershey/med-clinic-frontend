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
import { UserRole } from '@/types/user.types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  UserCheck,
  Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (user?.role !== UserRole.ADMIN) {
        router.push('/unauthorized'); // Redirect to unauthorized page
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Render a loading state or null while checking auth to prevent flash of content
  if (isLoading || !user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p>Loading...</p> {/* Or a more sophisticated loading spinner */}
      </div>
    );
  }

  const adminActions = [
    {
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage users, roles, and permissions across the system.',
      stats: '1,234 Active Users'
    },
    {
      title: 'System Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'View system performance and usage analytics.',
      stats: '98.5% Uptime'
    },
    {
      title: 'Security & Audit',
      href: '/admin/security',
      icon: Shield,
      description: 'Monitor security events and audit logs.',
      stats: '0 Critical Issues'
    },
    {
      title: 'Database Management',
      href: '/admin/database',
      icon: Database,
      description: 'Manage database operations and backups.',
      stats: 'Last backup: 2h ago'
    },
    {
      title: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Configure system-wide settings and preferences.',
      stats: 'All services active'
    },
    {
      title: 'Activity Monitor',
      href: '/admin/activity',
      icon: Activity,
      description: 'Real-time monitoring of system activities.',
      stats: '45 Active Sessions'
    },
  ];

  // If loading is false, user is authenticated, and role is ADMIN, render the dashboard
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Welcome Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Administrator Dashboard
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Welcome, {user?.full_name || user?.email || 'Admin User'}! Central administration panel for system management.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">1,234</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Sessions</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">45</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Uptime</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">99.9%</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Actions</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">12</p>
                </div>
                <UserCheck className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-200">
            Administrative Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminActions.map((action) => (
              <Link href={action.href} key={action.title} passHref>
                <Card className="group hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col cursor-pointer bg-white dark:bg-slate-800 border-0 shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-slate-700 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
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
      </div>
    </DashboardLayout>
  );
}
