'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserPlus, FileText } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-20 md:py-32 bg-blue-600 dark:bg-blue-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          Ready to Take Control of Your Health Journey?
        </h2>
        <p className="max-w-xl mx-auto text-lg text-blue-100 dark:text-blue-200 mb-10">
          Join MediConnect today and experience a new era of convenient and
          accessible healthcare. Signing up is quick, easy, and secure.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-slate-100 dark:text-blue-700 dark:hover:bg-slate-200 shadow-lg transform transition-transform hover:scale-105 group w-full sm:w-auto"
          >
            <Link href="/auth/register/patient" className="flex items-center">
              Register as a Patient <UserPlus className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-blue-800 border-white hover:bg-white/10 dark:text-white dark:border-slate-300 dark:hover:bg-white/5 w-full sm:w-auto"
          >
            <Link href="/auth/register/doctor" className="flex items-center">
              Apply to Join (Doctors) <FileText className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
