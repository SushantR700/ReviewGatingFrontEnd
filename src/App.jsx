import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import AdminPortal from './pages/AdminPortal';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Component to handle auto-redirect after login
const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If user is admin and on home page, redirect to admin portal
      if (user.role === 'ADMIN' && window.location.pathname === '/') {
        navigate('/admin');
      }
    }
  }, [user, loading, navigate]);

  return null;
};

function AppContent() {
  return (
    <>
      <AuthRedirect />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;