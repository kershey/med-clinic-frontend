'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react'; // Import Stethoscope
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // For bio
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { registerDoctor } from '@/services/auth.service';
import { DoctorRegistrationPayload } from '@/types/auth.types';
import Link from 'next/link';

const doctorRegistrationSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    first_name: z.string().min(1, { message: 'First name is required.' }),
    last_name: z.string().min(1, { message: 'Last name is required.' }),
    specialization: z.string().min(2, {
      message: 'Specialization must be at least 2 characters long.',
    }),
    bio: z.string().optional(),
    gender: z.string().optional(),
    contact: z
      .string()
      .min(10, { message: 'Contact number must be at least 10 digits.' })
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: 'Invalid contact number format.',
      })
      .optional(),
    address: z.string().optional(),
    // profile_image is not handled in this basic form, can be added later
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type DoctorRegistrationFormValues = z.infer<typeof doctorRegistrationSchema>;

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<DoctorRegistrationFormValues>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      specialization: '',
      bio: '',
      gender: '',
      contact: '',
      address: '',
    },
  });

  async function onSubmit(data: DoctorRegistrationFormValues) {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const { confirmPassword, first_name, last_name, ...restOfData } = data;
      const payload: DoctorRegistrationPayload = {
        ...restOfData,
        full_name: `${first_name} ${last_name}`,
        contact: data.contact || null,
        gender: data.gender || null,
        address: data.address || null,
        bio: data.bio || null,
      };
      await registerDoctor(payload);
      toast.success(
        'Doctor registration successful! Your account will be reviewed by an admin. You will be notified upon approval.'
      );
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        'Registration failed. Please try again.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SonnerToaster position="top-right" richColors />
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
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Doctor Registration
            </CardTitle>
            <CardDescription>
              Complete the form below to apply for a doctor account. Already
              registered?{' '}
              <Link
                href="/auth/login/doctor"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Login here
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Cardiology, Pediatrics"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biography (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a bit about your experience and expertise..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief professional biography (max 500 characters
                        recommended).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Male, Female, Other"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1234567890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, Clinic City"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {apiError && (
                  <p className="text-sm font-medium text-destructive">
                    {apiError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Submitting Application...'
                    : 'Register as Doctor'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Want to register as a patient?{' '}
              <Link
                href="/auth/register/patient"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Patient Registration
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
