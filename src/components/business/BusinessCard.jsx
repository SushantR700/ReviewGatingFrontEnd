import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../common/StarRating';

const BusinessCard = ({ business }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    console.log('=== BUSINESS CARD CLICK ===');
    console.log('Business:', business);
    
    if (business?.id) {
      navigate(`/business/${business.id}`);
    } else {
      console.error('No business ID available');
    }
  };

  if (!business) {
    console.error('BusinessCard: No business prop provided');
    return <div>No business data</div>;
  }

  // Debug logging for business data
  console.log('BusinessCard - Business data:', {
    id: business.id,
    name: business.businessName,
    averageRating: business.averageRating,
    totalReviews: business.totalReviews
  });

  // Format rating and reviews safely
  const averageRating = business.averageRating !== null && business.averageRating !== undefined ? business.averageRating : 0;
  const totalReviews = business.totalReviews !== null && business.totalReviews !== undefined ? business.totalReviews : 0;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleClick}>
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
            {business.businessName ? business.businessName.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {business.businessName || 'Unknown Business'}
        </h3>
        
        {business.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {business.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={averageRating} readOnly size={16} />
          <span className="text-sm text-gray-500">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        
        {business.address && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
            📍 {business.address}
          </p>
        )}
        
        <button
          onClick={handleClick}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Details
        </button>
        
       
      </div>
    </div>
  );
};

export default BusinessCard;