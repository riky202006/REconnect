import api from './api';

export const requestService = {
  getAll: async () => {
    try {
      return await api.get('/requests');
    } catch (err) {
      return null;
    }
  },

  create: async (requestData) => {
    try {
      return await api.post('/requests', requestData);
    } catch (err) {
      return requestData;
    }
  },

  updateStatus: async (requestId, status) => {
    try {
      return await api.patch(`/requests/${requestId}/status`, { status });
    } catch (err) {
      return { requestId, status };
    }
  },

  cancel: async (requestId) => {
    try {
      return await api.delete(`/requests/${requestId}`);
    } catch (err) {
      return { success: true, requestId };
    }
  }
};
