import api from './api';

export const businessService = {
  getAllBusinesses: () => api.get('/api/businesses'),
  searchBusinesses: (query) => api.get(`/api/businesses/search?name=${encodeURIComponent(query)}`),
  getBusinessById: (id) => api.get(`/api/businesses/${id}`),
  getBusinessImage: (id) => `${process.env.REACT_APP_API_BASE_URL}/api/businesses/${id}/image`,
  
  // Admin endpoints
  getMyBusinesses: () => api.get('/api/admin/businesses/my-businesses'),
  createBusiness: (formData) => api.post('/api/admin/businesses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBusiness: (id, formData) => api.put(`/api/admin/businesses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteBusiness: (id) => api.delete(`/api/admin/businesses/${id}`),
};