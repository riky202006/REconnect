import api from './api';

export const userService = {
  getProfile: async () => {
    try {
      return await api.get('/users/profile');
    } catch (err) {
      return null;
    }
  },

  updateProfile: async (userData) => {
    try {
      return await api.put('/users/profile', userData);
    } catch (err) {
      return userData;
    }
  },

  getLeaderboard: async (period = 'all') => {
    try {
      return await api.get('/users/leaderboard', { params: { period } });
    } catch (err) {
      return null;
    }
  }
};
