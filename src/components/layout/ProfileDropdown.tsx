'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
  Shield,
  Palette,
  Moon,
  Sun,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface ProfileDropdownProps {
  className?: string;
}

export function ProfileDropdown({ className = '' }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // You can implement actual theme switching logic here
    document.documentElement.classList.toggle('dark');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'doctor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'staff':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'patient':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending_activation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative h-12 w-auto gap-3 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-900/80 dark:border-gray-700 dark:hover:bg-gray-800 ${className}`}
        >
          <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
            <AvatarImage src={user?.avatarUrl} alt={user?.full_name || user?.email} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {getInitials(user?.full_name || user?.email || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-32">
              {user?.full_name || user?.email || 'User'}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${getRoleColor(user?.role || '')}`}>
                {user?.role || 'User'}
              </Badge>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 p-2 bg-white/95 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/95 dark:border-gray-700" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700">
              <AvatarImage src={user?.avatarUrl} alt={user?.full_name || user?.email} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(user?.full_name || user?.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.full_name || 'No name set'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-xs ${getRoleColor(user?.role || '')}`}>
                  {user?.role}
                </Badge>
                <Badge variant="secondary" className={`text-xs ${getStatusColor(user?.account_status || '')}`}>
                  {user?.account_status?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <div className="py-2">
          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Notifications</span>
            <Badge className="ml-auto bg-red-500 text-white text-xs px-2">3</Badge>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Palette className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Appearance</span>
          </DropdownMenuItem>

          {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Admin Panel</span>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-700" />

        <div className="py-2">
          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <HelpCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Help & Support</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}