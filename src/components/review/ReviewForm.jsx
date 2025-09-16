import React, { useState } from 'react';
import StarRating from '../common/StarRating';
import FeedbackForm from './FeedbackForm';
import { reviewService } from '../../services/reviewService';

const ReviewForm = ({ businessId, business, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    // Validate customer information if not anonymous
    if (!isAnonymous) {
      if (!customerName.trim()) {
        setError('Please enter your name or select anonymous');
        return;
      }
      if (!customerEmail.trim()) {
        setError('Please enter your email or select anonymous');
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Prevent double submission
    if (submitting) {
      console.log('Already submitting, ignoring duplicate request');
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('=== Submitting Review ===');
      console.log('Business ID:', businessId);
      console.log('Rating:', rating);
      console.log('Comment:', comment);
      console.log('Customer Info:', { customerName, customerEmail, customerPhone, isAnonymous });

      const reviewData = {
        rating,
        comment: comment.trim(),
        customerName: isAnonymous ? '' : customerName.trim(),
        customerEmail: isAnonymous ? '' : customerEmail.trim(),
        customerPhone: isAnonymous ? '' : customerPhone.trim(),
        isAnonymous
      };

      const response = await reviewService.createReviewAnonymous(businessId, reviewData);
      console.log('Review response:', response);
      
      setReviewResult(response.data);
      
      // Handle the response based on backend logic
      if (response.data.shouldRedirectToGoogle) {
        // High ratings (4-5) redirect to Google
        alert('Thank you for your positive review! You will be redirected to leave a Google review.');
        
        // Use business Google Review URL if available, otherwise generic Google search
        const googleUrl = business?.googleReviewUrl || 
                         `https://www.google.com/search?q=${encodeURIComponent(business?.businessName + ' review')}`;
        
        window.open(googleUrl, '_blank');
        onReviewSubmitted();
      } else if (response.data.shouldShowFeedbackForm) {
        // Low ratings (1-3) show feedback form
        console.log('Showing feedback form for low rating');
        setShowFeedbackForm(true);
      } else {
        // Default case - just finish
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      
      let errorMessage = 'Failed to submit review. Please try again.';
      
      if (error.response?.data) {
        // If the backend returned a specific error message
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedbackForm(false);
    onReviewSubmitted();
  };

  const handleSkipFeedback = () => {
    setShowFeedbackForm(false);
    onReviewSubmitted();
  };

  if (showFeedbackForm) {
    return (
      <FeedbackForm 
        reviewId={reviewResult?.review?.id} 
        onFeedbackSubmitted={handleFeedbackSubmitted}
        onSkip={handleSkipFeedback}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} size={30} />
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating >= 4 ? 'You\'ll be redirected to leave a Google review' : 'We\'d love your feedback to improve'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Tell others about your experience..."
            disabled={submitting}
          />
        </div>

        {/* Customer Information Section */}
        <div className="border-t pt-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={submitting}
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Submit as Anonymous (no contact information required)
            </label>
          </div>

          {!isAnonymous && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                    disabled={submitting}
                    required={!isAnonymous}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    disabled={submitting}
                    required={!isAnonymous}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone (Optional)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your phone number"
                  disabled={submitting}
                />
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;