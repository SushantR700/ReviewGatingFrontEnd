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

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await feedbackService.createFeedback(reviewId, feedbackData);
      onFeedbackSubmitted();
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Help us improve - Additional Feedback</h3>
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
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Quality</label>
            <select
              value={feedbackData.serviceQuality}
              onChange={(e) => setFeedbackData({...feedbackData, serviceQuality: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            />
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Feedback
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;