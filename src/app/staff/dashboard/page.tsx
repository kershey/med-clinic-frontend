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

export default function StaffDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Staff Dashboard</CardTitle>
          <CardDescription>
            Welcome, {user?.full_name || user?.email || 'Staff Member'}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is your staff dashboard. Manage operational tasks here.</p>
          <div>
            <h3 className="font-semibold">Your Details:</h3>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>Account Status: {user?.account_status}</p>
            {/* Add staff-specific details if available, e.g., user.staff_specifics */}
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
