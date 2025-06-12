"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ListChecks } from 'lucide-react'; // Updated icons

const HeroSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Effortless Medical Appointments, <br className="hidden sm:block" />
          Right at Your Fingertips.
        </h1>
        <p className="max-w-xl mx-auto text-lg sm:text-xl text-blue-100 dark:text-indigo-200 mb-10">
          MediConnect provides a seamless and secure platform for patients to find doctors and book appointments online. Manage your health journey with ease and confidence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-slate-100 dark:text-blue-700 dark:hover:bg-slate-200 shadow-lg transform transition-transform hover:scale-105 group w-full sm:w-auto">
            <Link href="/auth/register/patient" className="flex items-center">
              Book Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/70 text-white hover:bg-white/20 dark:border-indigo-300/70 dark:hover:bg-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-sm w-full sm:w-auto">
            <Link href="/doctors" className="flex items-center"> {/* Updated link and text */}
              List of Doctors <ListChecks className="ml-2 h-5 w-5" /> {/* Updated icon */}
            </Link>
          </Button>
        </div>

        {/* Optional: Small blurb for doctors/staff */}
        <p className="mt-12 text-sm text-blue-200 dark:text-indigo-300">
          Are you a Doctor or Clinic Staff? 
          <Link href="/auth/register/doctor" className="font-semibold underline hover:text-white ml-1">
            Join our network
          </Link> or 
          <Link href="/auth/login" className="font-semibold underline hover:text-white ml-1">
            Login here.
          </Link>
        </p>

      </div>
    </section>
  );
};

export default HeroSection;
