"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react"; // Import Stethoscope
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
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function DoctorLoginPage() { // Renamed component
  const router = useRouter();
  const { login, isLoading, error: authError, user } = useAuth(); 
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      toast.info("Already logged in. Redirecting...");
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "DOCTOR") {
        router.push("/doctor/dashboard");
      } else if (user.role === "STAFF") {
        router.push("/staff/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    }
  }, [user, router]);


  async function onSubmit(data: LoginFormValues) {
    try {
      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error("Doctor login page submit error:", error);
    }
  }

  return (
    <>
      <SonnerToaster position="bottom-right" richColors />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 mb-2">
            <Stethoscope className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-3xl text-slate-800 dark:text-slate-100">MediConnect</span>
          </Link>
          <p className="text-sm text-muted-foreground">Your seamless connection to healthcare.</p>
        </div>
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Doctor Login</CardTitle>
            <CardDescription>
              Access your professional dashboard. New here?{" "}
              <Link
                href="/auth/register/doctor"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Register as a Doctor
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {authError && (
                  <p className="text-sm font-medium text-destructive">
                    {authError}
                  </p>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Doctor"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 pt-6">
             <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot Password?
              </Link>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                <span>Switch role: </span>
                <Link href="/auth/login/patient" className="hover:underline text-blue-600 dark:text-blue-400">Patient</Link> |
                <Link href="/auth/login/staff" className="hover:underline text-blue-600 dark:text-blue-400"> Staff</Link> | 
                <Link href="/auth/login/admin" className="hover:underline text-blue-600 dark:text-blue-400"> Admin</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
