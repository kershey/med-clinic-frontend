"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { forgotPassword } from "@/services/auth.service";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    setApiError(null);
    setRequestSent(false);
    try {
      const response = await forgotPassword(data);
      toast.success(response.message || "If an account with that email exists, a password reset link has been sent.");
      setRequestSent(true);
      // Don't redirect, allow user to see the message.
      // Optionally, could clear form: form.reset();
    } catch (error: any) {
      // Even if the API returns an error (e.g., email not found), 
      // it's often better for security to show a generic success message.
      // However, if specific error handling is desired, uncomment below.
      // const errorMessage =
      //   error.response?.data?.detail || "Failed to send password reset link. Please try again.";
      // setApiError(errorMessage);
      // toast.error(errorMessage);
      
      // For now, always show a generic success to prevent email enumeration
      toast.success("If an account with that email exists, a password reset link has been sent.");
      setRequestSent(true); 
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SonnerToaster position=\"top-right\" richColors />
      <div className=\"min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4\">
        <Card className=\"w-full max-w-md\">
          <CardHeader>
            <CardTitle className=\"text-2xl font-bold\">Forgot Password</CardTitle>
            <CardDescription>
              {requestSent 
                ? "Please check your email for a password reset link."
                : "Enter your email address and we\'ll send you a link to reset your password."
              }
            </CardDescription>
          </CardHeader>
          {!requestSent && (
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=\"space-y-6\">
                  <FormField
                    control={form.control}
                    name=\"email\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type=\"email\"
                            placeholder=\"john.doe@example.com\"
                            {...field}
                          />
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
                  <Button type=\"submit\" className=\"w-full\" disabled={isSubmitting}>
                    {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
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
