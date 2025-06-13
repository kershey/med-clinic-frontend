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
import Link from 'next/link'; // For admin-specific links

export default function AdminDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      // Only redirect to login if user directly accessed this page without authentication
      // Avoid redirecting during logout process
      const currentPath = window.location.pathname;
      if (currentPath === '/admin/dashboard') {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Administrator Dashboard
          </CardTitle>
          <CardDescription>
            Welcome, {user?.full_name || user?.email || 'Admin User'}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This is the central administration panel. Manage users, settings,
            and monitor system activity.
          </p>
          <div>
            <h3 className="font-semibold">Your Details:</h3>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>Account Status: {user?.account_status}</p>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Admin Actions:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <Link
                  href="/admin/manage-users"
                  className="text-blue-600 hover:underline"
                >
                  Manage Users
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/audit-logs"
                  className="text-blue-600 hover:underline"
                >
                  View Audit Logs
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/system-settings"
                  className="text-blue-600 hover:underline"
                >
                  System Settings
                </Link>
              </li>
              {/* Add more admin links as features are built */}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => logout()} variant="outline">
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
