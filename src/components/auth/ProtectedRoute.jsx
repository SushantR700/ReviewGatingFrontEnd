import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role OR is an admin by email
  const isAuthorized = () => {
    if (!requiredRole) return true; // No specific role required
    
    if (requiredRole === 'ADMIN') {
      return (
        user.role === 'ADMIN' || 
        user.email === 'sushantregmi419@gmail.com' ||
        user.email?.endsWith('@brandbuilder.com')
      );
    }
    
    return user.role === requiredRole;
  };

  if (!isAuthorized()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;