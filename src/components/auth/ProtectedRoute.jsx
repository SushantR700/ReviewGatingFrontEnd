import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  console.log('=== ProtectedRoute Debug ===');
  console.log('Loading:', loading);
  console.log('User:', user);
  console.log('Required Role:', requiredRole);
  console.log('User Role:', user?.role);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Check if user has required role OR is an admin by email
  const isAuthorized = () => {
    if (!requiredRole) {
      console.log('No specific role required, allowing access');
      return true;
    }
    
    if (requiredRole === 'ADMIN') {
      const hasAdminRole = user.role === 'ADMIN';
      const hasAdminEmail = user.email === 'sushantregmi419@gmail.com' || user.email?.endsWith('@brandbuilder.com');
      
      console.log('Admin check:');
      console.log('- Has ADMIN role:', hasAdminRole);
      console.log('- Has admin email:', hasAdminEmail);
      console.log('- User email:', user.email);
      
      return hasAdminRole || hasAdminEmail;
    }
    
    const hasRole = user.role === requiredRole;
    console.log('Role check - Required:', requiredRole, 'User has:', user.role, 'Match:', hasRole);
    return hasRole;
  };

  const authorized = isAuthorized();
  console.log('Final authorization result:', authorized);

  if (!authorized) {
    console.log('User not authorized, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('User authorized, rendering children');
  return children;
};

export default ProtectedRoute;