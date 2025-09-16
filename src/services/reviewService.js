import api from './api';

export const reviewService = {
  getReviewsByBusiness: (businessId) => {
    console.log('Fetching reviews for business:', businessId);
    return api.get(`/api/reviews/business/${businessId}`).catch(error => {
      console.error('Error fetching reviews:', error);
      throw error;
    });
  },

  // NEW: Get reviews for business owner (admin access)
  getReviewsForBusinessOwner: (businessId) => {
    console.log('Fetching reviews for business owner, business:', businessId);
    return api.get(`/api/admin/reviews/business/${businessId}`).catch(error => {
      console.error('Error fetching reviews for business owner:', error);
      throw error;
    });
  },
  
  hasReviewedBusiness: (businessId) => {
    console.log('Checking if user has reviewed business:', businessId);
    return api.get(`/api/reviews/check/${businessId}`).catch(error => {
      console.error('Error checking review status:', error);
      throw error;
    });
  },
  
  createReview: (businessId, reviewData) => {
    console.log('Creating review for business:', businessId, 'with data:', reviewData);
    
    // Validate data before sending
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    return api.post(`/api/reviews/business/${businessId}`, {
      rating: parseInt(reviewData.rating), // Ensure rating is an integer
      comment: reviewData.comment || '' // Ensure comment is never undefined
    }).catch(error => {
      console.error('Error creating review:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    });
  },
  
  updateReview: (reviewId, reviewData) => {
    console.log('Updating review:', reviewId, 'with data:', reviewData);
    
    // Validate data before sending
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    return api.put(`/api/reviews/${reviewId}`, {
      rating: parseInt(reviewData.rating),
      comment: reviewData.comment || ''
    }).catch(error => {
      console.error('Error updating review:', error);
      throw error;
    });
  },
  
  deleteReview: (reviewId) => {
    console.log('Deleting review:', reviewId);
    return api.delete(`/api/reviews/${reviewId}`).catch(error => {
      console.error('Error deleting review:', error);
      throw error;
    });
  },
  
  getMyReviews: () => {
    console.log('Fetching my reviews...');
    return api.get('/api/reviews/my-reviews').catch(error => {
      console.error('Error fetching my reviews:', error);
      throw error;
    });
  },
};