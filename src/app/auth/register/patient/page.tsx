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
import { Label } from '@/components/ui/label'; // Keep Label for consistency if needed elsewhere, though FormLabel is primary here
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
import { registerPatient } from '@/services/auth.service';
import { PatientRegistrationPayload } from '@/types/auth.types'; // Will be inferred by Zod schema
import Link from 'next/link';

const patientRegistrationSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    first_name: z.string().min(1, { message: 'First name is required.' }), // Min 1 character
    last_name: z.string().min(1, { message: 'Last name is required.' }), // Min 1 character
    gender: z.string().optional(), // Made optional to align with PatientRegistrationPayload
    phone_number: z // Renamed to contact in the payload
      .string()
      .min(10, { message: 'Contact number must be at least 10 digits.' })
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: 'Invalid contact number format.',
      })
      .optional(), // Made optional to align
    address: z.string().optional(),
    // date_of_birth and medical_history are not in PatientRegistrationPayload, so removed for now
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type PatientRegistrationFormValues = z.infer<typeof patientRegistrationSchema>;

export default function PatientRegistrationPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<PatientRegistrationFormValues>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      gender: '',
      phone_number: '',
      address: '',
    },
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Invalid image type. Only jpg, png, webp allowed.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image too large. Max 2MB allowed.');
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  }

  async function onSubmit(data: PatientRegistrationFormValues) {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const {
        confirmPassword,
        first_name,
        last_name,
        phone_number,
        ...restOfData
      } = data;
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('full_name', `${first_name} ${last_name}`);
      formData.append('gender', data.gender || '');
      formData.append('contact', phone_number || '');
      formData.append('address', data.address || '');
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }
      await registerPatient(formData);
      toast.success(
        'Registration successful! Please check your email to verify your account.'
      );

      // Add delay to allow user to see the success toast
      setTimeout(() => {
        router.push('/auth/login');
        setIsSubmitting(false); // Set loading false after navigation
      }, 2500); // 2.5 second delay for registration (longer message)
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        'Registration failed. Please try again.';
      setApiError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false); // Set loading false on error
      // Log the full error for debugging if needed
      // console.error("Registration error:", error.response?.data || error.message);
    }
  }

  return (
    <>
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
              Create Patient Account
            </CardTitle>
            <CardDescription>
              Enter your details below to register. Already have an account?{' '}
              <Link
                href="/auth/login/patient"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Login here
              </Link>
              .
            </CardDescription>
          </CardHeader>
          {/* Avatar Upload just above the form fields */}
          <div className="flex flex-col items-center w-full mb-6 mt-2">
            <div className="relative flex flex-col items-center w-full mb-2">
              <div className="bg-white rounded-full shadow-lg border-4 border-blue-200 w-32 h-32 flex items-center justify-center transition-transform hover:scale-105 focus-within:scale-105">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="rounded-full w-32 h-32 object-cover"
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                )}
                <input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload profile image"
                  tabIndex={0}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  document.getElementById('profile_image')?.click()
                }
                className="mt-3 px-6 py-2 bg-blue-700 text-white rounded-full shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold transition"
                aria-label="Add or change profile image"
              >
                {profileImagePreview ? 'Change Image' : 'Add Image'}
              </button>
              <span className="text-xs text-gray-500 mt-1">
                Click avatar to upload/change
              </span>
            </div>
          </div>
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
                          <Input placeholder="John" {...field} />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender (Optional)</FormLabel>
                        <FormControl>
                          {/* Consider using a Select component for predefined options */}
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
                    name="phone_number" // This name is used by the form schema
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
                          placeholder="123 Main St, Anytown, USA"
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
                    ? 'Creating Account...'
                    : 'Create Patient Account'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Want to register as a different role?{' '}
              <Link
                href="/auth/register/doctor"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Doctor Registration
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
