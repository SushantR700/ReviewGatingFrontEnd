import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../common/StarRating';
import { businessService } from '../../services/businessService';

const BusinessCard = ({ business }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/business/${business.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
    >
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
        <div className="flex items-center justify-between">
          <StarRating rating={business.averageRating} readOnly />
          <span className="text-sm text-gray-500">
            {business.totalReviews} {business.totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        {business.address && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{business.address}</p>
        )}
      </div>
    </div>
  );
};

export default BusinessCard;