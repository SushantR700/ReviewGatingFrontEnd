import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import BusinessForm from '../components/business/BusinessForm';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { businessService } from '../services/businessService';
import { useAuth } from '../context/AuthContext';

const AdminPortal = () => {
  const { user, refreshUser, isAdmin } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AdminPortal mounted, user:', user);
    console.log('Is admin:', isAdmin);
    fetchMyBusinesses();
  }, []);

  const fetchMyBusinesses = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Fetching businesses...');
      
      const response = await businessService.getMyBusinesses();
      console.log('Businesses response:', response);
      setBusinesses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
      
      if (error.response?.status === 403) {
        setError('Access denied. You need to be logged in as a business owner to access this area.');
      } else if (error.response?.status === 401) {
        setError('Please log in as a business owner to access this area.');
      } else {
        setError('Failed to load businesses: ' + (error.response?.data || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSession = async () => {
    try {
      setLoading(true);
      await refreshUser();
      // Wait a moment for the auth context to update
      setTimeout(() => {
        fetchMyBusinesses();
      }, 1000);
    } catch (error) {
      console.error('Error refreshing session:', error);
      setError('Failed to refresh session');
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (formData) => {
    try {
      console.log('Creating business...');
      await businessService.createBusiness(formData);
      setShowBusinessForm(false);
      fetchMyBusinesses();
      alert('Business created successfully!');
    } catch (error) {
      console.error('Error creating business:', error);
      const errorMessage = error.response?.data || 'Failed to create business';
      alert(errorMessage);
    }
  };

  const handleUpdateBusiness = async (formData) => {
    try {
      console.log('Updating business...');
      await businessService.updateBusiness(editingBusiness.id, formData);
      setEditingBusiness(null);
      fetchMyBusinesses();
      alert('Business updated successfully!');
    } catch (error) {
      console.error('Error updating business:', error);
      const errorMessage = error.response?.data || 'Failed to update business';
      alert(errorMessage);
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    if (!window.confirm('Are you sure you want to delete this business?')) {
      return;
    }

    try {
      console.log('Deleting business...');
      await businessService.deleteBusiness(businessId);
      fetchMyBusinesses();
      alert('Business deleted successfully!');
    } catch (error) {
      console.error('Error deleting business:', error);
      const errorMessage = error.response?.data || 'Failed to delete business';
      alert(errorMessage);
    }
  };

  const handleBusinessOwnerLogin = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/login/oauth2/authorization/google?role=admin`;
  };

  const handleForceLogout = () => {
    // Clear everything and force logout
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/logout`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Access Error</h3>
            <p className="text-red-700 mb-4">{error}</p>
            
            {/* Debug info for troubleshooting */}
            <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
              <p><strong>Current User:</strong> {user?.name || 'Not logged in'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefreshSession}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh Session
              </button>
              <button
                onClick={fetchMyBusinesses}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Try Again
              </button>
              <button
                onClick={handleBusinessOwnerLogin}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Login as Business Owner
              </button>
              <button
                onClick={handleForceLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout & Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showBusinessForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BusinessForm
            onSubmit={handleCreateBusiness}
            onCancel={() => setShowBusinessForm(false)}
          />
        </div>
      </div>
    );
  }

  if (editingBusiness) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BusinessForm
            business={editingBusiness}
            onSubmit={handleUpdateBusiness}
            onCancel={() => setEditingBusiness(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Owner Portal</h1>
            <p className="text-gray-600">Manage your business profiles and reviews</p>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {user?.name} ({user?.role})
            </p>
          </div>
          <button
            onClick={() => setShowBusinessForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Business
          </button>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses yet</h3>
            <p className="text-gray-600 mb-4">Create your first business profile to get started</p>
            <button
              onClick={() => setShowBusinessForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Business Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {business.imageName ? (
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/businesses/${business.id}/image`}
                      alt={business.businessName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${business.imageName ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-white text-4xl font-bold">
                      {business.businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{business.businessName}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={business.averageRating || 0} readOnly />
                    <span className="text-sm text-gray-500">
                      {business.totalReviews || 0} reviews
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingBusiness(business)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBusiness(business.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;