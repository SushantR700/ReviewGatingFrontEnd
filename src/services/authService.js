import api from './api';

export const authService = {
  getAuthStatus: () => api.get('/api/auth/status'),
  getCurrentUser: () => api.get('/api/auth/user'),
  logout: () => api.post('/logout'),
};