"use client";

import React from 'react';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-800 dark:text-slate-100">MediConnect</span>
            </Link>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Simplifying your access to healthcare, one appointment at a time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 uppercase dark:text-white">Resources</h2>
              <ul className="text-slate-500 dark:text-slate-400 font-medium">
                <li className="mb-4">
                  <Link href="/#how-it-works" className="hover:underline">How It Works</Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">FAQs (Placeholder)</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-slate-500 dark:text-slate-400 font-medium">
                <li className="mb-4">
                  <Link href="/privacy-policy" className="hover:underline">Privacy Policy (Placeholder)</Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:underline">Terms of Service (Placeholder)</Link>
                </li>
              </ul>
            </div>
             <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 uppercase dark:text-white">Contact</h2>
              <ul className="text-slate-500 dark:text-slate-400 font-medium">
                <li className="mb-4">
                  <Link href="/contact" className="hover:underline">Contact Us (Placeholder)</Link>
                </li>
                <li>
                  <Link href="/support" className="hover:underline">Support (Placeholder)</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-slate-200 sm:mx-auto dark:border-slate-700 lg:my-8" />
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          © {currentYear} <Link href="/" className="hover:underline">MediConnect™</Link>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
