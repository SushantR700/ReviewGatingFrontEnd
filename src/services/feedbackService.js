import api from './api';

export const feedbackService = {
  createFeedback: (reviewId, feedbackData) => api.post(`/api/feedback/review/${reviewId}`, feedbackData),
  getFeedbackByReview: (reviewId) => api.get(`/api/feedback/review/${reviewId}`),
};