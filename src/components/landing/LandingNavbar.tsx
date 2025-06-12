'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu
import {
  Menu,
  X,
  Stethoscope,
  ChevronDown,
  ShieldCheck,
  ShieldPlus,
  UserCircle,
  UserPlus,
  BriefcaseMedical,
} from 'lucide-react'; // Added ShieldCheck, ShieldPlus, UserCircle, UserPlus, BriefcaseMedical
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ROLES = [
  {
    name: 'Patient',
    path: 'patient',
    IconLogin: UserCircle,
    IconRegister: UserPlus,
  },
  {
    name: 'Doctor',
    path: 'doctor',
    IconLogin: BriefcaseMedical,
    IconRegister: BriefcaseMedical,
  }, // Example, adjust icon
  {
    name: 'Staff',
    path: 'staff',
    IconLogin: UserCircle,
    IconRegister: UserPlus,
  }, // Example, adjust icon
];

const LandingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const commonLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    // { href: "/about", label: "About Us" }, // Example future link
    // { href: "/contact", label: "Contact" }, // Example future link
  ];

  const handleDashboardRedirect = () => {
    if (user) {
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'DOCTOR':
          router.push('/doctor/dashboard');
          break;
        case 'STAFF':
          router.push('/staff/dashboard');
          break;
        case 'PATIENT':
          router.push('/patient/dashboard');
          break;
        default:
          router.push('/');
      }
    } else {
      router.push('/auth/login'); // Fallback if user is null despite being authenticated (should not happen)
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-slate-900/90">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-xl text-slate-800 dark:text-slate-100">
            MediConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {commonLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Button
                onClick={handleDashboardRedirect}
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => logout()}
                variant="ghost"
                className="hover:bg-blue-50 dark:hover:bg-blue-900/50"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/50 flex items-center"
                  >
                    Login <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-border/40">
                  {ROLES.map((role) => (
                    <Link
                      key={role.path}
                      href={`/auth/login/${role.path}`}
                      passHref
                    >
                      <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center">
                        <role.IconLogin className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          Login as {role.name}
                        </span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  <Link href="/auth/login/admin" passHref>
                    <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        Admin Login
                      </span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Register Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center">
                    Register <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-border/40">
                  {ROLES.map((role) => (
                    <Link
                      key={role.path}
                      href={`/auth/register/${role.path}`}
                      passHref
                    >
                      <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center">
                        <role.IconRegister className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          Register as {role.name}
                        </span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  {/* Admin registration often requires a different flow or is restricted */}
                  {/* For now, adding it similarly. Consider if this flow is appropriate. */}
                  <Link href="/auth/register/admin" passHref>
                    <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center">
                      <ShieldPlus className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        Admin Registration
                      </span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs bg-white dark:bg-slate-950"
            >
              <div className="flex flex-col space-y-6 p-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2 mb-6"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xl">MediConnect</span>
                </Link>
                {commonLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-md font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-4 dark:border-slate-700" />
                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => {
                        handleDashboardRedirect();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-blue-500 text-blue-600"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Mobile Login Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-between"
                        >
                          Login <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[calc(100%-2rem)] bg-white dark:bg-slate-800 shadow-lg rounded-md border border-border/40 mt-1 relative left-4">
                        {ROLES.map((role) => (
                          <Link
                            key={role.path}
                            href={`/auth/login/${role.path}`}
                            passHref
                          >
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <role.IconLogin className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                              <span className="text-sm text-slate-700 dark:text-slate-200">
                                Login as {role.name}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                        ))}
                        <Link href="/auth/login/admin" passHref>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-200">
                              Admin Login
                            </span>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Register Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-between">
                          Register <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[calc(100%-2rem)] bg-white dark:bg-slate-800 shadow-lg rounded-md border border-border/40 mt-1 relative left-4">
                        {ROLES.map((role) => (
                          <Link
                            key={role.path}
                            href={`/auth/register/${role.path}`}
                            passHref
                          >
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <role.IconRegister className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                              <span className="text-sm text-slate-700 dark:text-slate-200">
                                Register as {role.name}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                        ))}
                        <Link href="/auth/register/admin" passHref>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 p-2 flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ShieldPlus className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-200">
                              Admin Registration
                            </span>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
