"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays, ShieldCheck, Search, Zap } from 'lucide-react'; // Example icons

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, className }) => {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-slate-800/50 ${className}`}>
      <CardHeader className="flex flex-col items-center text-center pb-4">
        <div className="mb-4 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-full text-white">
          <Icon className="h-10 w-10" />
        </div>
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Find Doctors Easily",
      description: "Quickly search and filter for qualified doctors by specialization, location, and availability. Find the right care when you need it.",
    },
    {
      icon: CalendarDays,
      title: "Seamless Online Booking",
      description: "Book appointments 24/7 with a few clicks. Get instant confirmations and manage your bookings all in one place.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      description: "Your health information is protected with top-tier security measures, ensuring confidentiality and peace of mind.",
    },
    {
        icon: Zap,
        title: "Instant Notifications",
        description: "Receive timely reminders for your appointments and important updates directly through the platform or via email."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Everything You Need for Better Healthcare Access
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            MediConnect is designed to simplify your healthcare experience, from finding a doctor to managing your appointments efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
