import React from 'react';
import StarRating from '../common/StarRating';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <StarRating rating={review.rating} readOnly size={16} />
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-700 font-medium mb-1">{review.customer?.name || 'Anonymous'}</p>
      {review.comment && <p className="text-gray-600">{review.comment}</p>}
    </div>
  );
};

export default ReviewCard;