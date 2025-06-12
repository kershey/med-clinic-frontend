"use client";

import React from 'react';
import { UserPlus, Search, CalendarCheck, CheckCircle } from 'lucide-react'; // Example icons

interface StepProps {
  icon: React.ElementType;
  stepNumber: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ icon: Icon, stepNumber, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative mb-6">
        <div className="absolute -top-8 -left-8 bg-blue-500 text-white dark:bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold shadow-md">
          {stepNumber}
        </div>
        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-full text-white inline-block shadow-lg">
          <Icon className="h-10 w-10" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      stepNumber: 1,
      title: "Create Your Account",
      description: "Quickly sign up as a patient or apply to join our network as a doctor. It only takes a few minutes!",
    },
    {
      icon: Search,
      stepNumber: 2,
      title: "Find Your Doctor",
      description: "Browse or search for doctors by specialty, location, or name. View profiles and availability.",
    },
    {
      icon: CalendarCheck,
      stepNumber: 3,
      title: "Book an Appointment",
      description: "Select a suitable time slot and book your appointment instantly. Get confirmation and reminders.",
    },
    {
      icon: CheckCircle,
      stepNumber: 4,
      title: "Attend & Manage",
      description: "Attend your appointment and manage your health records and future bookings all in one secure place.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Get Started in 4 Easy Steps
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Booking your medical appointments has never been simpler. Follow these steps to connect with healthcare providers.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pt-8">
          {steps.map((step) => (
            <Step
              key={step.stepNumber}
              icon={step.icon}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
