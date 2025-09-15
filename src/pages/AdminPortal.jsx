import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import BusinessForm from '../components/business/BusinessForm';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { businessService } from '../services/businessService';

const AdminPortal = () => {
  const [businesses, setBusinesses] = useState([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBusinesses();
  }, []);

  const fetchMyBusinesses = async () => {
    try {
      const response = await businessService.getMyBusinesses();
      setBusinesses(response.data);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (formData) => {
    try {
      await businessService.createBusiness(formData);
      setShowBusinessForm(false);
      fetchMyBusinesses();
      alert('Business created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to create business';
      alert(errorMessage);
    }
  };

  const handleUpdateBusiness = async (formData) => {
    try {
      await businessService.updateBusiness(editingBusiness.id, formData);
      setEditingBusiness(null);
      fetchMyBusinesses();
      alert('Business updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to update business';
      alert(errorMessage);
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    if (!window.confirm('Are you sure you want to delete this business?')) {
      return;
    }

    try {
      await businessService.deleteBusiness(businessId);
      fetchMyBusinesses();
      alert('Business deleted successfully!');
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to delete business';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
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
                  {business.imageData ? (
                    <img
                      src={businessService.getBusinessImage(business.id)}
                      alt={business.businessName}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {business.businessName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{business.businessName}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={business.averageRating} readOnly />
                    <span className="text-sm text-gray-500">
                      {business.totalReviews} reviews
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