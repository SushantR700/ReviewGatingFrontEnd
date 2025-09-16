import api from './api';

export const businessService = {
  getAllBusinesses: () => {
    console.log('Fetching all businesses...');
    return api.get('/api/businesses').catch(error => {
      console.error('Error fetching businesses:', error);
      throw error;
    });
  },
  
  searchBusinesses: (query) => {
    console.log('Searching businesses with query:', query);
    return api.get(`/api/businesses/search?name=${encodeURIComponent(query)}`).catch(error => {
      console.error('Error searching businesses:', error);
      throw error;
    });
  },
  
  getBusinessById: (id) => {
    console.log('Fetching business by ID:', id);
    return api.get(`/api/businesses/${id}`).catch(error => {
      console.error('Error fetching business by ID:', error);
      throw error;
    });
  },

  // NEW: Get business by name (slug)
  getBusinessByName: (businessNameSlug) => {
    console.log('Fetching business by name slug:', businessNameSlug);
    return api.get(`/api/businesses/name/${encodeURIComponent(businessNameSlug)}`).catch(error => {
      console.error('Error fetching business by name:', error);
      throw error;
    });
  },
  
  getBusinessImage: (id) => `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/businesses/${id}/image`,
  
  // Admin endpoints
  getMyBusinesses: () => {
    console.log('Fetching my businesses...');
    return api.get('/api/admin/businesses/my-businesses').catch(error => {
      console.error('Error fetching my businesses:', error);
      if (error.response?.status === 403) {
        console.error('Access denied - check user role');
      }
      throw error;
    });
  },
  
  createBusiness: (formData) => {
    console.log('Creating business...');
    return api.post('/api/admin/businesses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).catch(error => {
      console.error('Error creating business:', error);
      throw error;
    });
  },
  
  updateBusiness: (id, formData) => {
    console.log('Updating business:', id);
    return api.put(`/api/admin/businesses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).catch(error => {
      console.error('Error updating business:', error);
      throw error;
    });
  },
  
  deleteBusiness: (id) => {
    console.log('Deleting business:', id);
    return api.delete(`/api/admin/businesses/${id}`).catch(error => {
      console.error('Error deleting business:', error);
      throw error;
    });
  },
};