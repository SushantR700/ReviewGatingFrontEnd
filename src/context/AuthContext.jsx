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
      console.log('=== Checking Auth Status ===');
      const statusResponse = await authService.getAuthStatus();
      console.log('Auth status response:', statusResponse.data);
      
      if (statusResponse.data && statusResponse.data.authenticated) {
        const userData = await authService.getCurrentUser();
        console.log('User data from server:', userData.data);
        setUser(userData.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (role = 'customer') => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    // Use the login endpoint that properly sets the role
    window.location.href = `${baseUrl}/login/oauth2/authorization/google?role=${role}`;
  };

  const logout = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
      
      // First, logout from the backend
      await fetch(`${baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Clear local state
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
    console.log('=== Refreshing User Data ===');
    setLoading(true);
    await checkAuthStatus();
  };

  // Helper function to check if user is admin
  const isUserAdmin = (userData = user) => {
    if (!userData) return false;
    
    return userData.role === 'ADMIN' || 
           userData.email === 'sushantregmi419@gmail.com' ||
           userData.email === 'junkiethunder@gmail.com' ||
           userData.email?.endsWith('@brandbuilder.com');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: isUserAdmin(),
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