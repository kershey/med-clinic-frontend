'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  getCurrentUserProfile as apiGetCurrentUserProfile,
  refreshToken as apiRefreshToken,
} from '../services/auth.service';
import { AuthenticatedUser, UserRole } from '../types/user.types';
import { LoginPayload, LoginResponse } from '../types/auth.types';
import { useRouter } from 'next/navigation'; // Using next/navigation for App Router
import { toast } from 'sonner';

interface AuthContextType {
  user: AuthenticatedUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (payload: LoginPayload, role?: UserRole) => Promise<void>;
  logout: (role?: UserRole) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>; // Function to re-validate token/user
  setUser: React.Dispatch<React.SetStateAction<AuthenticatedUser | null>>; // Expose setUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check auth on load
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getRedirectPath = (role?: UserRole): string => {
    if (!role) return '/'; // Default redirect if role is not specified
    switch (role) {
      case UserRole.PATIENT:
        return '/patient/dashboard';
      case UserRole.DOCTOR:
        return '/doctor/dashboard';
      case UserRole.STAFF:
        return '/staff/dashboard';
      case UserRole.ADMIN:
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getLoginPath = (role?: UserRole): string => {
    if (!role) return '/login'; // Default redirect if role is not specified
    switch (role) {
      case UserRole.PATIENT:
        return '/login/patient';
      case UserRole.DOCTOR:
        return '/login/doctor';
      case UserRole.STAFF:
        return '/login/staff'; // Staff login might be different (e.g., after activation)
      case UserRole.ADMIN:
        return '/login/admin';
      default:
        return '/login';
    }
  };

  const handleAuthResponse = (data: LoginResponse) => {
    setUser(data.user);
    setAccessToken(data.access_token);
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setError(null);
  };

  const clearAuthData = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser)); // Optimistically set user
      try {
        // Optionally re-fetch user profile to ensure data is fresh and token is valid
        const freshUser = await apiGetCurrentUserProfile(); // This uses the storedToken via the service's internal logic
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
        console.log('User session restored and verified.');
      } catch (e) {
        console.error(
          'Session restore error (apiGetCurrentUserProfile failed), attempting refresh or clearing:',
          e
        );
        // Try to refresh token if profile fetch fails (indicates expired access token)
        try {
          const refreshData = await apiRefreshToken(); // This uses refreshToken from localStorage via service's internal logic
          handleAuthResponse(refreshData);
          console.log('Token refreshed successfully during auth check.');
        } catch (refreshError) {
          console.error(
            'Token refresh failed during auth check, clearing session:',
            refreshError
          );
          clearAuthData(); // This will set user and token to null
        }
      }
    } else {
      clearAuthData(); // Ensure clean state if no token/user
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (payload: LoginPayload, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiLoginUser(payload);
      handleAuthResponse(data);
      toast.success('Login successful!');

      // Add second toast after a short delay to show loading dashboard
      // setTimeout(() => {
      //   toast.loading('Loading dashboard...');
      // }, 800);

      // Add delay to allow user to see the success toast
      setTimeout(() => {
        router.push(getRedirectPath(data.user.role)); // Redirect based on actual user role from response
        setIsLoading(false); // Set loading false after navigation
      }, 1500); // 1.5 second delay
    } catch (err: any) {
      clearAuthData();
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      console.error('Login error:', err.response || err);
      setIsLoading(false); // Set loading false on error
      throw err; // Re-throw for form error handling
    }
  };

  const logout = async (role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiLogoutUser(); // Call backend logout
    } catch (err) {
      console.error('Backend logout error:', err);
      // Still proceed with client-side cleanup, but redirect is prioritized
    }
    router.push('/'); // Redirect to home page immediately
    clearAuthData(); // Then clear auth data
    setIsLoading(false); // Finally, update loading state
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        error,
        login,
        logout,
        clearError,
        checkAuth,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
