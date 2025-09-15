import React from 'react';
import StarRating from '../common/StarRating';

const ReviewCard = ({ review }) => {
  const getDisplayDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      // Parse the ISO date string from backend (2025-09-15T20:28:51)
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      
      // Format to readable date and time
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if error occurs
    }
  };

  const getCustomerName = () => {
    if (review.customer?.name) {
      return review.customer.name;
    }
    return 'Anonymous Customer';
  };

  // Debug logging
  console.log('ReviewCard - review object:', review);
  console.log('ReviewCard - createdAt (raw):', review.createdAt);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <StarRating rating={review.rating || 0} readOnly size={16} />
          <span className="text-sm font-medium text-gray-700">
            {review.rating || 0}/5
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {getDisplayDate(review.createdAt)}
        </span>
      </div>
      
      <div className="mb-2">
        <p className="text-gray-800 font-medium text-sm">
          {getCustomerName()}
        </p>
      </div>
      
      {review.comment && review.comment.trim() && (
        <div className="mt-2">
          <p className="text-gray-600 text-sm leading-relaxed">
            {review.comment}
          </p>
        </div>
      )}
      
      {review.redirectedToGoogle && (
        <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          ✓ Redirected to Google Reviews
        </div>
      )}
    </div>
  );
};

export default ReviewCard;