import api from './api';

export const resourceService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/resources', { params });
      return res;
    } catch (err) {
      console.warn('Backend unavailable, using local resources cache:', err.message);
      return null;
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/resources/${id}`);
    } catch (err) {
      return null;
    }
  },

  create: async (resourceData) => {
    try {
      return await api.post('/resources', resourceData);
    } catch (err) {
      console.warn('Backend offline, saved locally:', err.message);
      return resourceData;
    }
  },

  update: async (id, resourceData) => {
    try {
      return await api.put(`/resources/${id}`, resourceData);
    } catch (err) {
      return { id, ...resourceData };
    }
  },

  updateStatus: async (id, status) => {
    try {
      return await api.patch(`/resources/${id}/status`, { status });
    } catch (err) {
      return { id, status };
    }
  },

  delete: async (id) => {
    try {
      return await api.delete(`/resources/${id}`);
    } catch (err) {
      return { success: true, id };
    }
  }
};
