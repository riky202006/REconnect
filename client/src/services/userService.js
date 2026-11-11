import api from './api';

export const userService = {
  getProfile: async () => {
    // return api.get('/users/profile');
    return null;
  },

  updateProfile: async (userData) => {
    // return api.put('/users/profile', userData);
    return userData;
  },

  getLeaderboard: async (period = 'all') => {
    // return api.get('/users/leaderboard', { params: { period } });
    return null;
  }
};

