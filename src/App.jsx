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

// Simple test page
const TestPage = () => {
  const { id } = useLocation().pathname.split('/').pop();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Test Business Page</h1>
        <p>Business ID: {id}</p>
        <p>This is a simple test page to verify routing works.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <>
      <RouteLogger />
      <AuthRedirect />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test/:id" element={<TestPage />} />
        <Route path="/business/:id" element={<BusinessDetailPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPortal />
            </ProtectedRoute>
          } 
        />
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