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
  getActivationTokenStatus, // Re-using this to check token validity and get email
  resetPassword,
} from "@/services/auth.service";
import Link from "next/link";

const resetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
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

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string | undefined;

  const [tokenInfo, setTokenInfo] = useState<{
    isValid: boolean;
    message: string;
    email?: string | null;
    isLoading: boolean;
    error?: string | null;
  }>({ isValid: false, message: "", isLoading: true });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      setTokenInfo((prev) => ({ ...prev, isLoading: true }));
      getActivationTokenStatus(token)
        .then((response) => {
          setTokenInfo({
            isValid: response.is_valid,
            message: response.message,
            email: response.email,
            isLoading: false,
          });
          if (response.is_valid && response.email) {
            form.setValue("email", response.email);
            toast.info(`Ready to reset password for ${response.email}`);
          } else if (!response.is_valid) {
            toast.error(response.message || "Invalid or expired password reset token.");
          }
        })
        .catch((error) => {
          const errMsg = error.response?.data?.detail || "Failed to verify reset token.";
          setTokenInfo({
            isValid: false,
            message: errMsg,
            isLoading: false,
            error: errMsg,
          });
          toast.error(errMsg);
        });
    } else {
      setTokenInfo({
        isValid: false,
        message: "Password reset token not found in URL.",
        isLoading: false,
      });
      toast.error("Password reset token not found.");
      router.push("/auth/login"); 
    }
  }, [token, router, form]);

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token || !tokenInfo.isValid) {
      toast.error("Cannot proceed: password reset token is invalid or missing.");
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      const response = await resetPassword({
        email: data.email,
        reset_token: token,
        new_password: data.newPassword,
      });
      toast.success(response.message || "Password has been reset successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Password reset failed. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (tokenInfo.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying reset link...</p>
      </div>
    );
  }

  return (
    <>
      <SonnerToaster position=\"top-right\" richColors />
      <div className=\"min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4\">
        <Card className=\"w-full max-w-md\">
          <CardHeader>
            <CardTitle className=\"text-2xl font-bold\">Reset Your Password</CardTitle>
            {!tokenInfo.isValid && tokenInfo.message && (
                 <CardDescription className=\"text-red-500\">
                    Status: {tokenInfo.message}
                </CardDescription>
            )}
          </CardHeader>
          
          {tokenInfo.isValid ? (
            <CardContent>
              <p className=\"mb-4 text-sm text-muted-foreground\">
                Enter your email and new password for {form.getValues("email") || "your account"}.
              </p>
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
                            readOnly={!!tokenInfo.email} // Make read-only if email came from token
                            className={tokenInfo.email ? "bg-gray-100 dark:bg-gray-800" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <Button type=\"submit\" className=\"w-full\" disabled={isSubmitting || !tokenInfo.isValid}>
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          ) : (
            <CardContent>
              <p className=\"text-center text-red-600\">
                {tokenInfo.message || "This password reset link is invalid or has expired."}
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
