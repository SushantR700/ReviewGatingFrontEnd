import React, { useState } from 'react';
import StarRating from '../common/StarRating';
import FeedbackForm from './FeedbackForm';
import { reviewService } from '../../services/reviewService';

const ReviewForm = ({ businessId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewService.createReview(businessId, { rating, comment });
      setReviewResult(response.data);
      
      if (response.data.shouldRedirectToGoogle) {
        alert('Thank you for your positive review! You will be redirected to leave a Google review.');
        window.open('https://www.google.com/search?q=leave+review', '_blank');
      }
      
      if (response.data.shouldShowFeedbackForm) {
        setShowFeedbackForm(true);
      } else {
        onReviewSubmitted();
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to submit review. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedbackForm(false);
    onReviewSubmitted();
  };

  if (showFeedbackForm) {
    return (
      <FeedbackForm 
        reviewId={reviewResult?.review?.id} 
        onFeedbackSubmitted={handleFeedbackSubmitted}
        onSkip={handleFeedbackSubmitted}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} size={30} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Tell others about your experience..."
          />
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