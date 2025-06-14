'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Mail,
  Timer,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { verifyEmail, resendVerificationEmail } from '@/services/auth.service';
import Link from 'next/link';

const verificationSchema = z.object({
  verification_code: z
    .string()
    .min(6, { message: 'Verification code must be at least 6 characters.' })
    .max(10, { message: 'Verification code must not exceed 10 characters.' }),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verification_code: '',
    },
  });

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error('No email provided for verification');
      router.push('/auth/login/patient');
    }
  }, [email, router]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onSubmit = async (data: VerificationFormValues) => {
    if (!email) return;

    setIsLoading(true);
    try {
      // Create a promise that resolves after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await verifyEmail({
        email,
        verification_code: data.verification_code,
      });

      setIsVerified(true);
      toast.success('Email verified successfully!');

      // Redirect to login after successful verification
      // setTimeout(() => {
      //   router.push('/auth/login/patient?verified=true');
      // }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Verification failed. Please check your code.';

      if (errorMessage.toLowerCase().includes('expired')) {
        toast.error('Verification code has expired. Please request a new one.');
      } else if (errorMessage.toLowerCase().includes('invalid')) {
        toast.error('Invalid verification code. Please check and try again.');
      } else {
        toast.error(errorMessage);
      }

      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    try {
      console.log('Sending resend request for email:', email);
      const result = await resendVerificationEmail({ email });
      console.log('Resend verification result:', result);
      toast.success('New verification code sent to your email!');
      setResendCooldown(60); // 60 second cooldown
      form.setValue('verification_code', ''); // Clear the form
    } catch (error: any) {
      console.error('Resend verification error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        fullError: error,
      });
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to resend verification code.';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <>
        <SonnerToaster position="bottom-right" richColors />
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-2">
              <Stethoscope className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-3xl text-slate-800 dark:text-slate-100">
                MediConnect
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your seamless connection to healthcare.
            </p>
          </div>

          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                Email Verified!
              </CardTitle>
              <CardDescription className="text-center">
                Your email has been successfully verified. You can now login to
                your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/auth/login/patient">Continue to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SonnerToaster position="bottom-right" richColors />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 mb-2">
            <Stethoscope className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-3xl text-slate-800 dark:text-slate-100">
              MediConnect
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Your seamless connection to healthcare.
          </p>
        </div>

        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              We've sent a verification code to{' '}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {email}
              </span>
              <br />
              Enter the code below to verify your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="verification_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit code"
                          className="text-center text-lg tracking-widest"
                          {...field}
                          onChange={(e) => {
                            // Allow only numbers and letters and limit to reasonable length
                            const value = e.target.value
                              .replace(/[^a-zA-Z0-9]/g, '')
                              .slice(0, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Timer className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Didn't receive the code?
              </p>

              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleResendCode}
                disabled={isResending || resendCooldown > 0}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <Timer className="mr-2 h-4 w-4" />
                    Resend in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Check your spam folder if you don't see the email</span>
              </div>

              <div className="flex justify-center mt-3">
                <Link
                  href="/auth/login/patient"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
