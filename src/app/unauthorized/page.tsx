'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'; // Using lucide-react icons
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user.types';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return '/';
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.DOCTOR:
        return '/doctor/dashboard';
      case UserRole.STAFF:
        return '/staff/dashboard';
      case UserRole.PATIENT:
        return '/patient/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900 dark:to-rose-950 p-4">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden">
        <CardHeader className="bg-red-600 dark:bg-red-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <ShieldAlert size={40} />
            <div>
              <CardTitle className="text-3xl font-bold">Access Denied</CardTitle>
              <CardDescription className="text-red-100 dark:text-red-200">
                You do not have permission to view this page.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6 bg-white dark:bg-slate-800">
          <p className="text-slate-700 dark:text-slate-300 text-center text-lg">
            We're sorry, but the page you are trying to access is restricted.
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="border-t dark:border-slate-700 pt-6 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              If you need to access your designated area, please use the links below:
            </p>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full group dark:border-slate-600 dark:hover:bg-slate-700"
              aria-label="Go back to the previous page"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && router.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>

            {isAuthenticated && user ? (
              <Button asChild className="w-full group bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Link href={getDashboardPath()}>
                  <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Go to My Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full group bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Go to Homepage
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-850 p-4 border-t dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center w-full">
                If issues persist, please contact support or your system administrator.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
