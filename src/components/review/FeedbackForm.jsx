import React, { useState } from 'react';
import { feedbackService } from '../../services/feedbackService';

const FeedbackForm = ({ reviewId, onFeedbackSubmitted, onSkip }) => {
  const [feedbackData, setFeedbackData] = useState({
    feedbackText: '',
    serviceQuality: '',
    staffBehavior: '',
    cleanliness: '',
    valueForMoney: '',
    overallExperience: '',
    suggestions: '',
    contactEmail: '',
    contactPhone: '',
    wantsFollowup: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');
    
    // Prevent double submission
    if (submitting) {
      console.log('Already submitting feedback, ignoring duplicate request');
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('=== Submitting Feedback ===');
      console.log('Review ID:', reviewId);
      console.log('Feedback data:', feedbackData);

      await feedbackService.createFeedback(reviewId, feedbackData);
      console.log('Feedback submitted successfully');
      onFeedbackSubmitted();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      let errorMessage = 'Failed to submit feedback. Please try again.';
      
      if (error.response?.data) {
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

  const handleSkip = () => {
    if (submitting) {
      console.log('Cannot skip while submitting');
      return;
    }
    onSkip();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Help us improve - Additional Feedback</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmitFeedback} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tell us more about your experience
          </label>
          <textarea
            value={feedbackData.feedbackText}
            onChange={(e) => setFeedbackData({...feedbackData, feedbackText: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="What could we have done better?"
            disabled={submitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Quality</label>
            <select
              value={feedbackData.serviceQuality}
              onChange={(e) => setFeedbackData({...feedbackData, serviceQuality: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            >
              <option value="">Select...</option>
              <option value="poor">Poor</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff Behavior</label>
            <select
              value={feedbackData.staffBehavior}
              onChange={(e) => setFeedbackData({...feedbackData, staffBehavior: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            >
              <option value="">Select...</option>
              <option value="poor">Poor</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={feedbackData.wantsFollowup}
              onChange={(e) => setFeedbackData({...feedbackData, wantsFollowup: e.target.checked})}
              className="mr-2"
              disabled={submitting}
            />
            <span className="text-sm text-gray-700">I would like someone to follow up with me</span>
          </label>
        </div>

        {feedbackData.wantsFollowup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={feedbackData.contactEmail}
              onChange={(e) => setFeedbackData({...feedbackData, contactEmail: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              disabled={submitting}
            />
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;