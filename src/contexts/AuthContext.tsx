import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Transaction, MonthlyBudget } from '../types';

interface AuthContextType {
  token: string | null;
  userId: number | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = '/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [userId, setUserId] = useState<number | null>(Number(localStorage.getItem('user_id')) || null);
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  useEffect(() => {
    // Generate device token if not exists
    if (!localStorage.getItem('device_token')) {
      const deviceToken = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('device_token', deviceToken);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setToken(data.token);
      setUserId(data.userId);
      setUsername(data.username);
      
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.userId.toString());
      localStorage.setItem('username', data.username);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setToken(data.token);
      setUserId(data.userId);
      setUsername(data.username);
      
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.userId.toString());
      localStorage.setItem('username', data.username);
      
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    // Call logout API
    if (token) {
      fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': token },
      }).catch(() => {});
    }

    setToken(null);
    setUserId(null);
    setUsername(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('cute-finance-profile');
    localStorage.removeItem('cute-finance-transactions');
    localStorage.removeItem('cute-finance-budgets');
  };

  return (
    <AuthContext.Provider value={{
      token,
      userId,
      username,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// API helper with auth
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    window.location.reload();
    throw new Error('Unauthorized');
  }

  return response;
};
