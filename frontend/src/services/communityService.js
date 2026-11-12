import api from './api';
import { mockCommunityInfo } from '../data/mockData';

export const communityService = {
  getInfo: async () => {
    try {
      return await api.get('/community');
    } catch (err) {
      return mockCommunityInfo;
    }
  }
};

