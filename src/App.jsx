import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import AdminPortal from './pages/AdminPortal';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Debug component to log route changes
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('=== ROUTE CHANGE ===');
    console.log('Current pathname:', location.pathname);
    console.log('Current search:', location.search);
    console.log('Full location:', location);
  }, [location]);

  return null;
};

// Component to handle auto-redirect after login
const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== AUTH REDIRECT CHECK ===');
    console.log('User:', user);
    console.log('Loading:', loading);
    console.log('Current path:', window.location.pathname);
    
    if (!loading && user) {
      // If user is admin and on home page, redirect to admin portal
      if (user.role === 'ADMIN' && window.location.pathname === '/') {
        console.log('Redirecting admin to /admin');
        navigate('/admin');
      }
    }
  }, [user, loading, navigate]);

  return null;
};

// Business Detail Route Component
const BusinessDetailRoute = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Extract business identifier from URL
  // Could be either ID (for backward compatibility) or business name slug
  const businessIdentifier = pathname.substring(1); // Remove leading slash
  
  console.log('BusinessDetailRoute - pathname:', pathname);
  console.log('BusinessDetailRoute - identifier:', businessIdentifier);
  
  return <BusinessDetailPage businessIdentifier={businessIdentifier} />;
};

// Route Guard Component to handle business name routing
const BusinessRouteGuard = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Skip routing logic for admin and other known routes
  if (pathname === '/admin' || pathname === '/' || pathname.startsWith('/admin/')) {
    return null;
  }
  
  // For all other routes, treat as potential business names
  return <BusinessDetailRoute />;
};

function AppContent() {
  return (
    <>
      <RouteLogger />
      <AuthRedirect />
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Admin portal */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPortal />
            </ProtectedRoute>
          } 
        />
        
        {/* Business detail pages - catch all non-admin routes */}
        <Route path="/*" element={<BusinessRouteGuard />} />
      </Routes>
    </>
  );
}

function App() {
  console.log('=== APP COMPONENT RENDERING ===');
  
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;