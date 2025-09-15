import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BusinessCard from '../components/business/BusinessCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { businessService } from '../services/businessService';

const HomePage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchBusinesses = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const searchTerm = urlParams.get('search');
      
      let response;
      if (searchTerm) {
        response = await businessService.searchBusinesses(searchTerm);
      } else {
        response = await businessService.getAllBusinesses();
      }
      
      setBusinesses(response.data);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Great Businesses</h1>
          <p className="text-gray-600">Discover and review local businesses in your area</p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;