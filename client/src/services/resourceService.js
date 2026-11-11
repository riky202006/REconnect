import api from './api';

export const resourceService = {
  getAll: async (params = {}) => {
    // return api.get('/resources', { params });
    return null; // Signals caller to use local reactive state or fallback
  },

  getById: async (id) => {
    // return api.get(`/resources/${id}`);
    return null;
  },

  create: async (resourceData) => {
    // return api.post('/resources', resourceData);
    return resourceData;
  },

  update: async (id, resourceData) => {
    // return api.put(`/resources/${id}`, resourceData);
    return { id, ...resourceData };
  },

  delete: async (id) => {
    // return api.delete(`/resources/${id}`);
    return { success: true, id };
  }
};

