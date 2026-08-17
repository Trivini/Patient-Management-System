import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('pms_token', response.data.token);
      localStorage.setItem('pms_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('pms_token', response.data.token);
      localStorage.setItem('pms_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout API warning:', e);
    } finally {
      localStorage.removeItem('pms_token');
      localStorage.removeItem('pms_user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('pms_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('pms_token');
  }
};
