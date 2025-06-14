'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Camera, User as UserIcon, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import { UserRole, type AuthenticatedUser } from '@/types/user.types';

const profileFormSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say'], {
    message: 'Please select a valid gender.',
  }),
  address: z.string().max(255).optional().or(z.literal('')),
  contact: z.string().max(20).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function PatientSettingsPage() {
  const { user, accessToken, setUser, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    user?.profile_image || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      gender: 'Prefer not to say',
      address: '',
      contact: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name || '',
        gender:
          (user.gender as ProfileFormValues['gender']) || 'Prefer not to say',
        address: user.address || '',
        contact: user.contact || '',
      });
      setProfileImagePreview(user.profile_image || null);
    }
  }, [user, form]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Session expired. Please log in again.');
      router.push('/login/patient');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File is too large. Maximum size is 2MB.');
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
        return;
      }
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!isAuthenticated || !user || !accessToken) {
      toast.error('Authentication error. Please log in again.');
      router.push('/login/patient');
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('gender', data.gender);
    formData.append('address', data.address || '');
    formData.append('contact', data.contact || '');

    if (profileImageFile) {
      formData.append('profile_image', profileImageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/me/patient`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to update profile.');
      }

      toast.success('Profile updated successfully!');
      if (setUser) {
        setUser((prevUser: AuthenticatedUser | null) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            ...responseData,
            profile_image: responseData.profile_image || prevUser.profile_image,
          };
        });
      }
      setProfileImageFile(null);
      if (responseData.profile_image) {
        setProfileImagePreview(responseData.profile_image);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';
      toast.error(`Update failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="mb-4">Redirecting to login...</p>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    console.error('Inconsistent state: Authenticated but user is null.');
    toast.error('An unexpected error occurred. Please try refreshing.');
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Error loading user data. Please refresh.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your profile information and account preferences.
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-muted shadow-md">
                  <AvatarImage
                    src={profileImagePreview || undefined}
                    alt={user.full_name || 'User avatar'}
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {user.full_name ? (
                      user.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    ) : (
                      <UserIcon size={48} />
                    )}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile picture"
                >
                  <Camera className="mr-2 h-4 w-4" /> Change Picture
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Max 2MB. JPG, PNG, or WEBP.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...form.register('full_name')}
                    placeholder="Your full name"
                  />
                  {form.formState.errors.full_name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={form.watch('gender')}
                    onValueChange={(value) =>
                      form.setValue(
                        'gender',
                        value as ProfileFormValues['gender'],
                        { shouldValidate: true }
                      )
                    }
                  >
                    <SelectTrigger id="gender" aria-label="Select gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.gender.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    {...form.register('address')}
                    placeholder="Your address"
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number (Optional)</Label>
                  <Input
                    id="contact"
                    {...form.register('contact')}
                    placeholder="Your contact number"
                  />
                  {form.formState.errors.contact && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.contact.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !isAuthenticated}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
