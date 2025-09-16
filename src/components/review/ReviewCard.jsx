import React, { useState, useEffect } from 'react';
import StarRating from '../common/StarRating';

const ReviewCard = ({ review, showFeedback = false }) => {
  const [feedback, setFeedback] = useState(null);

  // Only fetch feedback if we're in admin context and it's a low rating
  useEffect(() => {
    if (showFeedback && review.rating <= 3) {
      fetchFeedback();
    }
  }, [review.id, review.rating, showFeedback]);

  const fetchFeedback = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/feedback/review/${review.id}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const feedbackData = await response.json();
        setFeedback(feedbackData);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      // Feedback might not exist, which is okay
    }
  };

  const getDisplayDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
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
      return dateString;
    }
  };

  const getCustomerName = () => {
    if (review.isAnonymous) {
      return 'Anonymous Customer';
    }
    
    if (review.customerName && review.customerName.trim()) {
      return review.customerName;
    }

    if (review.customer) {
      if (review.customer.name && review.customer.name.trim()) {
        return review.customer.name;
      }
      if (review.customer.email) {
        const emailPart = review.customer.email.split('@')[0];
        return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
      }
    }
    
    if (review.customerEmail && review.customerEmail.trim()) {
      const emailPart = review.customerEmail.split('@')[0];
      return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
    }
    
    return 'Anonymous Customer';
  };

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
        {review.isAnonymous && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 mt-1">
            Anonymous Review
          </span>
        )}
      </div>
      
      {review.comment && review.comment.trim() && (
        <div className="mt-2">
          <p className="text-gray-600 text-sm leading-relaxed">
            {review.comment}
          </p>
        </div>
      )}

      {/* Show additional feedback ONLY if showFeedback prop is true (admin context) */}
      {showFeedback && feedback && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Additional Feedback:</h4>
          
          {feedback.feedbackText && (
            <div className="mb-2">
              <p className="text-sm text-blue-700">
                <strong>Comments:</strong> "{feedback.feedbackText}"
              </p>
            </div>
          )}

          {/* Show detailed ratings if any exist */}
          {(feedback.serviceQuality || feedback.staffBehavior || feedback.cleanliness || 
            feedback.valueForMoney || feedback.overallExperience) && (
            <div className="mb-2">
              <p className="text-xs font-medium text-blue-800 mb-1">Detailed Ratings:</p>
              <div className="text-xs text-blue-700 space-y-1">
                {feedback.serviceQuality && (
                  <div>Service Quality: <span className="font-medium capitalize">{feedback.serviceQuality}</span></div>
                )}
                {feedback.staffBehavior && (
                  <div>Staff Behavior: <span className="font-medium capitalize">{feedback.staffBehavior}</span></div>
                )}
                {feedback.cleanliness && (
                  <div>Cleanliness: <span className="font-medium capitalize">{feedback.cleanliness}</span></div>
                )}
                {feedback.valueForMoney && (
                  <div>Value for Money: <span className="font-medium capitalize">{feedback.valueForMoney}</span></div>
                )}
                {feedback.overallExperience && (
                  <div>Overall Experience: <span className="font-medium capitalize">{feedback.overallExperience}</span></div>
                )}
              </div>
            </div>
          )}

          {feedback.suggestions && (
            <div className="mb-2">
              <p className="text-sm text-blue-700">
                <strong>Suggestions:</strong> "{feedback.suggestions}"
              </p>
            </div>
          )}

          {feedback.wantsFollowup && (
            <div className="text-xs text-blue-600 font-medium">
              ⚠️ Customer requested follow-up
            </div>
          )}
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