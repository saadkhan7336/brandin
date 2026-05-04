import api from "./api";

const paymentService = {
  /**
   * Fund escrow for a collaboration
   * @param {string} collaborationId 
   */
  fundEscrow: async (collaborationId) => {
    try {
      const response = await api.post('/payment/escrow/fund', { collaborationId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  syncEscrowStatus: async (collaborationId) => {
    try {
      const response = await api.post('/payment/escrow/sync', { collaborationId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Start a deliverable (Influencer)
   * @param {string} deliverableId 
   */
  startDeliverable: async (deliverableId) => {
    try {
      const response = await api.post(`/payment/deliverable/${deliverableId}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Submit a deliverable (Influencer)
   * @param {string} deliverableId 
   * @param {Object} data - { submissionFiles }
   */
  submitDeliverable: async (deliverableId, data) => {
    try {
      const response = await api.post(`/payment/deliverable/${deliverableId}/submit`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Approve a deliverable (Brand)
   * @param {string} deliverableId 
   */
  approveDeliverable: async (deliverableId) => {
    try {
      const response = await api.post(`/payment/deliverable/${deliverableId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get onboarding link for Stripe Connect
   */
  onboardConnect: async () => {
    try {
      const response = await api.post('/payment/connect/onboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Card Management (Brand)
   */
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payment/methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removePaymentMethod: async (paymentMethodId) => {
    try {
      const response = await api.delete(`/payment/methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Transaction History
   */
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payment/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;
