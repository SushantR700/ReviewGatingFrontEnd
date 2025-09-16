import api from './api';

export const feedbackService = {
  createFeedback: (reviewId, feedbackData) => {
    console.log('Creating feedback for review:', reviewId, 'with data:', feedbackData);
    
    // Validate required data
    if (!reviewId) {
      throw new Error('Review ID is required');
    }
    
    // Clean the feedback data to ensure no undefined values
    const cleanedData = {
      feedbackText: feedbackData.feedbackText || '',
      serviceQuality: feedbackData.serviceQuality || '',
      staffBehavior: feedbackData.staffBehavior || '',
      cleanliness: feedbackData.cleanliness || '',
      valueForMoney: feedbackData.valueForMoney || '',
      overallExperience: feedbackData.overallExperience || '',
      suggestions: feedbackData.suggestions || '',
      contactEmail: feedbackData.contactEmail || '',
      contactPhone: feedbackData.contactPhone || '',
      wantsFollowup: Boolean(feedbackData.wantsFollowup)
    };
    
    return api.post(`/api/feedback/review/${reviewId}`, cleanedData).catch(error => {
      console.error('Error creating feedback:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    });
  },
  
  getFeedbackByReview: (reviewId) => {
    console.log('Getting feedback for review:', reviewId);
    return api.get(`/api/feedback/review/${reviewId}`).catch(error => {
      console.error('Error getting feedback:', error);
      throw error;
    });
  },
};