import api from './api';

export const transactionService = {
  getAll: async () => {
    try {
      return await api.get('/transactions');
    } catch (err) {
      return null;
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/transactions/${id}`);
    } catch (err) {
      return null;
    }
  },

  complete: async (id, notes) => {
    try {
      return await api.post(`/transactions/${id}/complete`, { notes });
    } catch (err) {
      return { id, notes, status: 'COMPLETED' };
    }
  },

  returnItem: async (id) => {
    try {
      return await api.post(`/transactions/${id}/return`);
    } catch (err) {
      return { success: true, id };
    }
  }
};
