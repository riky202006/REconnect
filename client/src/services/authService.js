import api from './api';
import { mockCurrentUser } from '../data/mockData';

export const authService = {
  login: async (credentials) => {
    try {
      // In production with real backend:
      // const res = await api.post('/auth/login', credentials);
      // return res;
      // Mock demonstration:
      localStorage.setItem('reconnect_token', 'mock_jwt_token_' + Date.now());
      localStorage.setItem('reconnect_user', JSON.stringify(mockCurrentUser));
      return { success: true, user: mockCurrentUser, token: 'mock_jwt_token_123' };
    } catch (err) {
      throw err;
    }
  },

  register: async (userData) => {
    try {
      // const res = await api.post('/auth/register', userData);
      // return res;
      const newUser = {
        ...mockCurrentUser,
        id: 'usr_' + Date.now(),
        name: userData.fullName || userData.name,
        email: userData.email,
        community: userData.community || 'ADTU - Main Campus (Panikhaiti)',
      };
      localStorage.setItem('reconnect_token', 'mock_jwt_token_' + Date.now());
      localStorage.setItem('reconnect_user', JSON.stringify(newUser));
      return { success: true, user: newUser, token: 'mock_jwt_token_new' };
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
    return userStr ? JSON.parse(userStr) : mockCurrentUser;
  }
};

