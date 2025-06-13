'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Users,
  FileText,
  Settings,
  BarChart3,
  PlusCircle,
  UserCheck,
  Stethoscope,
  ClipboardList,
  Shield,
  Database,
  Menu,
  X,
  Home,
  Building2,
  UserCog,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types/user.types';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [UserRole.PATIENT, UserRole.DOCTOR, UserRole.STAFF, UserRole.ADMIN],
  },
  // Patient specific items
  {
    label: 'Book Appointment',
    href: '/patient/appointments/book',
    icon: PlusCircle,
    roles: [UserRole.PATIENT],
  },
  {
    label: 'My Appointments',
    href: '/patient/appointments',
    icon: Calendar,
    roles: [UserRole.PATIENT],
  },
  {
    label: 'Medical Records',
    href: '/patient/medical-records',
    icon: FileText,
    roles: [UserRole.PATIENT],
  },
  // Doctor specific items
  {
    label: 'Patient Schedule',
    href: '/doctor/schedule',
    icon: Calendar,
    roles: [UserRole.DOCTOR],
  },
  {
    label: 'Patient Records',
    href: '/doctor/patients',
    icon: Users,
    roles: [UserRole.DOCTOR],
  },
  {
    label: 'Consultations',
    href: '/doctor/consultations',
    icon: Stethoscope,
    roles: [UserRole.DOCTOR],
  },
  // Staff specific items
  {
    label: 'Appointment Management',
    href: '/staff/appointments',
    icon: ClipboardList,
    roles: [UserRole.STAFF],
  },
  {
    label: 'Patient Registration',
    href: '/staff/patients/register',
    icon: UserCheck,
    roles: [UserRole.STAFF],
  },
  {
    label: 'Reports',
    href: '/staff/reports',
    icon: BarChart3,
    roles: [UserRole.STAFF],
  },
  // Admin specific items
  {
    label: 'User Management',
    href: '/admin/users',
    icon: UserCog,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Security & Audit',
    href: '/admin/security',
    icon: Shield,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Database Management',
    href: '/admin/database',
    icon: Database,
    roles: [UserRole.ADMIN],
  },
  // Common items
  {
    label: 'Profile Settings',
    href: '/profile',
    icon: Settings,
    roles: [UserRole.PATIENT, UserRole.DOCTOR, UserRole.STAFF, UserRole.ADMIN],
  },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => 
    user?.role && item.roles.includes(user.role as UserRole)
  );

  // Get current dashboard path based on user role
  const getDashboardPath = () => {
    switch (user?.role) {
      case UserRole.PATIENT:
        return '/patient/dashboard';
      case UserRole.DOCTOR:
        return '/doctor/dashboard';
      case UserRole.STAFF:
        return '/staff/dashboard';
      case UserRole.ADMIN:
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Update dashboard item href based on user role
  const getItemHref = (item: SidebarItem) => {
    if (item.href === '/dashboard') {
      return getDashboardPath();
    }
    return item.href;
  };

  const isActivePath = (href: string) => {
    if (href === getDashboardPath()) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return Shield;
      case UserRole.DOCTOR:
        return Stethoscope;
      case UserRole.STAFF:
        return Building2;
      case UserRole.PATIENT:
        return Activity;
      default:
        return Home;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <RoleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                MedApp Dashboard
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role?.toLowerCase()} Portal
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="p-2 h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const href = getItemHref(item);
          const isActive = isActivePath(href);

          return (
            <Link key={item.label} href={href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 transition-all duration-200 relative",
                  isCollapsed ? "px-2" : "px-3",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-gray-500 dark:text-gray-400")} />
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <RoleIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {user?.full_name || 'User'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role?.toLowerCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}