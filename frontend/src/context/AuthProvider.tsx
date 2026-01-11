import React, { useState } from 'react';
import { AuthContext, AuthUser, Role, AuthContextValue } from './AuthContext';
import { login as apiLogin } from '../api/auth';
import type { LoginResponse } from '../api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser) as AuthUser;
    } catch {
      return null;
    }
  });

  const handleLogin = async (email: string, password: string) => {
    const data: LoginResponse = await apiLogin(email, password);

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role as Role,
    };

    setToken(data.access_token);
    setUser(authUser);

    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(authUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
