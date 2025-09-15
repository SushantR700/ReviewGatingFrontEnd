import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BusinessCard from '../components/business/BusinessCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { businessService } from '../services/businessService';

const HomePage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchBusinesses = useCallback(async () => {
    try {
      console.log('HomePage: Starting to fetch businesses...');
      setLoading(true);
      setError(null);
      
      const urlParams = new URLSearchParams(location.search);
      const searchTerm = urlParams.get('search');
      
      let response;
      if (searchTerm) {
        console.log('HomePage: Searching for:', searchTerm);
        response = await businessService.searchBusinesses(searchTerm);
      } else {
        console.log('HomePage: Fetching all businesses...');
        response = await businessService.getAllBusinesses();
      }
      
      console.log('HomePage: Received response:', response);
      setBusinesses(response.data || []);
    } catch (error) {
      console.error('HomePage: Failed to fetch businesses:', error);
      setError(`Failed to load businesses: ${error.message}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Businesses</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchBusinesses}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
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
          {location.search && (
            <p className="text-sm text-gray-500 mt-2">
              Showing results for: "{new URLSearchParams(location.search).get('search')}"
            </p>
          )}
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">
              {location.search 
                ? "Try adjusting your search terms or browse all businesses." 
                : "No businesses have been added yet. Check back later."}
            </p>
            {location.search && (
              <button
                onClick={() => window.location.href = '/'}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Browse All Businesses
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Found {businesses.length} business{businesses.length !== 1 ? 'es' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;