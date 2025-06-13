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

export default function DoctorDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Doctor Dashboard</CardTitle>
          <CardDescription>
            Welcome, Dr. {user?.full_name || user?.email || 'User'}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This is your professional dashboard. Manage your appointments and
            patient interactions here.
          </p>
          <div>
            <h3 className="font-semibold">Your Details:</h3>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>Account Status: {user?.account_status}</p>
            {user?.doctor_specifics && (
              <>
                <p>Specialization: {user?.doctor_specifics?.specialization}</p>
                <p>
                  Availability: {user?.doctor_specifics?.availability_status}
                </p>
              </>
            )}
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
