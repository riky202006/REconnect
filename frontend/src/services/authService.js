import api from './api';
import { mockCurrentUser } from '../data/mockData';

export const authService = {
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res && res.token) {
        localStorage.setItem('reconnect_token', res.token);
        localStorage.setItem('reconnect_user', JSON.stringify(res.user));
      }
      return res;
    } catch (err) {
      // Graceful offline fallback for demo account if backend server is not running
      if (credentials.email === mockCurrentUser.email) {
        console.warn('Backend unavailable, falling back to local session');
        localStorage.setItem('reconnect_token', 'mock_jwt_token_' + Date.now());
        localStorage.setItem('reconnect_user', JSON.stringify(mockCurrentUser));
        return { success: true, user: mockCurrentUser, token: 'mock_jwt_token_123' };
      }
      throw err;
    }
  },

  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res && res.token) {
        localStorage.setItem('reconnect_token', res.token);
        localStorage.setItem('reconnect_user', JSON.stringify(res.user));
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('reconnect_token');
    localStorage.removeItem('reconnect_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('reconnect_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    if (res && res.user) {
      localStorage.setItem('reconnect_user', JSON.stringify(res.user));
      return res.user;
    }
    return null;
  }
};
