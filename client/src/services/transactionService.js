import api from './api';

export const transactionService = {
  getAll: async () => {
    // return api.get('/transactions');
    return null;
  },

  getById: async (id) => {
    // return api.get(`/transactions/${id}`);
    return null;
  },

  complete: async (id, notes) => {
    // return api.post(`/transactions/${id}/complete`, { notes });
    return { id, notes, status: 'COMPLETED' };
  }
};

