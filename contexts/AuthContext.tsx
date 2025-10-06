'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setLoading(false);

        
        return;
      }

      

      try {
        const response = await apiClient.get<User>('/auth/check-auth');

        console.log("Check-auth response:", response)
        if (response.success && response.data) {
          setUser(response.data);
          setToken(storedToken);
          // Set user role cookie for middleware
          if (typeof window !== 'undefined') {
            document.cookie = `user_role=${response.data.role}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
          }
        } else {
          console.log("Auth failed - response.success:", response.success, "response.data:", response.data);
          localStorage.removeItem('auth_token');
        }
      } catch (error: any) {
        console.error("Check-auth failed:", error)
        localStorage.removeItem('auth_token');
        // Clear cookies as well
        if (typeof window !== 'undefined') {
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    apiClient.login(newToken, newUser.role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    apiClient.logout();
    if (typeof window !== 'undefined') {
      // Ensure all auth-related storage is cleared
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
