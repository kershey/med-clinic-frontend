'use client';

import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { ProfileDropdown } from './ProfileDropdown';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* You can add breadcrumbs or page title here */}
            </div>
            
            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </header>
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}