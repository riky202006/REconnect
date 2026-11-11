import api from './api';

export const requestService = {
  getAll: async () => {
    // return api.get('/requests');
    return null;
  },

  create: async (requestData) => {
    // return api.post('/requests', requestData);
    return requestData;
  },

  updateStatus: async (requestId, status) => {
    // return api.patch(`/requests/${requestId}/status`, { status });
    return { requestId, status };
  },

  cancel: async (requestId) => {
    // return api.delete(`/requests/${requestId}`);
    return { success: true, requestId };
  }
};

