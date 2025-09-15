import React from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessCard = ({ business }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    console.log('=== BUSINESS CARD CLICK DEBUG ===');
    console.log('Business object:', business);
    console.log('Business ID:', business?.id);
    console.log('Current location:', window.location.href);
    console.log('Target path:', `/business/${business?.id}`);
    
    // Test different navigation methods
    console.log('Attempting navigation...');
    
    try {
      // Method 1: React Router navigate
      console.log('Method 1: Using React Router navigate');
      navigate(`/business/${business.id}`);
    } catch (error) {
      console.error('React Router navigate failed:', error);
      
      // Method 2: Direct window location
      console.log('Method 2: Using window.location');
      window.location.href = `/business/${business.id}`;
    }
  };

  if (!business) {
    console.error('BusinessCard: No business prop provided');
    return <div>No business data</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          {business.businessName || 'Unknown Business'}
        </h3>
        <p className="text-sm text-gray-600 mb-2">ID: {business.id}</p>
        <p className="text-sm text-gray-600 mb-4">
          Rating: {business.averageRating || 0} ({business.totalReviews || 0} reviews)
        </p>
        
        <button
          onClick={handleClick}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details (Debug)
        </button>
        
        <div className="mt-2 text-xs text-gray-500">
          Target: /business/{business.id}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;