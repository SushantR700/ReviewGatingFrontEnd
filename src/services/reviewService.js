import api from './api';

export const reviewService = {
  getReviewsByBusiness: (businessId) => api.get(`/api/reviews/business/${businessId}`),
  hasReviewedBusiness: (businessId) => api.get(`/api/reviews/check/${businessId}`),
  createReview: (businessId, reviewData) => api.post(`/api/reviews/business/${businessId}`, reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/api/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/api/reviews/${reviewId}`),
  getMyReviews: () => api.get('/api/reviews/my-reviews'),
};