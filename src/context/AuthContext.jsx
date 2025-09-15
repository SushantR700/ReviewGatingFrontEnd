import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.getAuthStatus();
      
      if (response.data && response.data.authenticated) {
        const userData = await authService.getCurrentUser();
        console.log('Auth data from server:', userData.data);
        setUser(userData.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (provider = 'google') => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  const logout = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
      await fetch(`${baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(null);
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  // Function to force refresh user data
  const refreshUser = async () => {
    setLoading(true);
    await checkAuthStatus();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isCustomer: user?.role === 'CUSTOMER'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};