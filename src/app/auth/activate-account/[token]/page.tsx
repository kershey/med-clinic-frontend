"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster as SonnerToaster, toast } from "sonner";
import {
  getActivationTokenStatus,
  staffActivateAccount,
} from "@/services/auth.service";
import Link from "next/link";

const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export default function ActivateAccountPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string | undefined;

  const [tokenStatus, setTokenStatus] = useState<{
    isValid: boolean;
    message: string;
    email?: string | null;
    isLoading: boolean;
    error?: string | null;
  }>({ isValid: false, message: "", isLoading: true });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      setTokenStatus((prev) => ({ ...prev, isLoading: true }));
      getActivationTokenStatus(token)
        .then((response) => {
          setTokenStatus({
            isValid: response.is_valid,
            message: response.message,
            email: response.email,
            isLoading: false,
          });
          if (!response.is_valid) {
            toast.error(response.message || "Invalid or expired activation token.");
          }
        })
        .catch((error) => {
          const errMsg = error.response?.data?.detail || "Failed to verify token.";
          setTokenStatus({
            isValid: false,
            message: errMsg,
            isLoading: false,
            error: errMsg,
          });
          toast.error(errMsg);
        });
    } else {
      setTokenStatus({
        isValid: false,
        message: "Activation token not found in URL.",
        isLoading: false,
      });
      toast.error("Activation token not found.");
      router.push("/auth/login"); // Or a more appropriate page
    }
  }, [token, router]);

  async function onSubmit(data: SetPasswordFormValues) {
    if (!token || !tokenStatus.isValid) {
      toast.error("Cannot proceed: activation token is invalid or missing.");
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      const response = await staffActivateAccount(token, {
        new_password: data.newPassword,
        confirm_password: data.confirmPassword, // Backend expects confirm_password too
      });
      toast.success(response.message || "Account activated successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Account activation failed. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (tokenStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading token information...</p>
        {/* Add a spinner component here if available */}
      </div>
    );
  }

  return (
    <>
      <SonnerToaster position=\"top-right\" richColors />
      <div className=\"min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4\">
        <Card className=\"w-full max-w-md\">
          <CardHeader>
            <CardTitle className=\"text-2xl font-bold\">Activate Your Account</CardTitle>
            {tokenStatus.email && (
              <CardDescription>
                Activating account for: {tokenStatus.email}
              </CardDescription>
            )}
            {!tokenStatus.isValid && tokenStatus.message && (
                 <CardDescription className=\"text-red-500\">
                    Status: {tokenStatus.message}
                </CardDescription>
            )}
          </CardHeader>
          
          {tokenStatus.isValid ? (
            <CardContent>
              <p className=\"mb-4 text-sm text-muted-foreground\">Please set your password to activate your account.</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=\"space-y-6\">
                  <FormField
                    control={form.control}
                    name=\"newPassword\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type=\"password\" placeholder=\"********\" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name=\"confirmPassword\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type=\"password\" placeholder=\"********\" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {apiError && (
                    <p className=\"text-sm font-medium text-destructive\">
                      {apiError}
                    </p>
                  )}
                  <Button type=\"submit\" className=\"w-full\" disabled={isSubmitting || !tokenStatus.isValid}>
                    {isSubmitting ? "Activating..." : "Set Password and Activate"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          ) : (
            <CardContent>
              <p className=\"text-center text-red-600\">
                {tokenStatus.message || "This activation link is invalid or has expired."}
              </p>
            </CardContent>
          )}
          
          <CardFooter className=\"flex flex-col items-center space-y-2 pt-4\">
            <Link
                href=\"/auth/login\"
                className=\"text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300\"
              >
                Back to Login
              </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
