import api from "./api";
import { ENDPOINTS } from "./endpoints";

const collaborationService = {
  /**
   * Get collaboration requests
   * @param {Object} params - Query params { status, page, limit }
   */
  getRequests: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.collaborations.getRequests, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Accept collaboration request
   * @param {string} requestId 
   */
  acceptRequest: async (requestId) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.acceptRequest(requestId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Reject collaboration request
   * @param {string} requestId 
   */
  rejectRequest: async (requestId) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.rejectRequest(requestId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cancel collaboration request
   * @param {string} requestId 
   */
  cancelRequest: async (requestId) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.cancelRequest(requestId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  /**
   * Send a counter-offer
   * @param {string} requestId 
   * @param {Object} data - { newBudget, note }
   */
  counterOffer: async (requestId, data) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.counterOffer(requestId), data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all collaborations
   * @param {Object} params - Query params { status, search, page, limit }
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.collaborations.getAll, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get single collaboration details
   * @param {string} id 
   */
  getOne: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.collaborations.getOne(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get latest active collaboration with a specific user
   * @param {string} otherUserId 
   */
  getLatestWithUser: async (otherUserId) => {
    try {
      const response = await api.get(ENDPOINTS.collaborations.getLatestWithUser(otherUserId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add a deliverable (Brand only)
   */
  addDeliverable: async (id, data) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.addDeliverable(id), data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a deliverable (Brand only for details)
   */
  updateDeliverable: async (id, delivId, data) => {
    try {
      const response = await api.patch(ENDPOINTS.collaborations.updateDeliverable(id, delivId), data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a deliverable (Brand only)
   */
  deleteDeliverable: async (id, delivId) => {
    try {
      const response = await api.delete(ENDPOINTS.collaborations.deleteDeliverable(id, delivId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Submit a deliverable (Influencer only)
   */
  submitDeliverable: async (id, delivId, data) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.submitDeliverable(id, delivId), data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Review a deliverable (Brand only)
   */
  reviewDeliverable: async (id, delivId, data) => {
    try {
      const response = await api.patch(ENDPOINTS.collaborations.reviewDeliverable(id, delivId), data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Pause collaboration (Brand only)
   */
  pause: async (id) => {
    try {
      const response = await api.patch(ENDPOINTS.collaborations.pause(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Resume collaboration (Brand only)
   */
  resume: async (id) => {
    try {
      const response = await api.patch(ENDPOINTS.collaborations.resume(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Suspend collaboration (Brand only)
   */
  suspend: async (id) => {
    try {
      const response = await api.patch(ENDPOINTS.collaborations.suspend(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Complete collaboration (Brand only, with review)
   */
  complete: async (id, reviewData) => {
    try {
      const response = await api.patch(ENDPOINTS.collaborations.complete(id), { reviewData });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Submit an action request (Influencer/Brand)
   */
  requestAction: async (id, data) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.requestAction(id), data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Handle an action request (Approve/Reject)
   */
  handleAction: async (id, data) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.handleAction(id), data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Submit influencer's review of a brand (post-completion)
   */
  submitInfluencerReview: async (id, reviewData) => {
    try {
      const response = await api.post(ENDPOINTS.collaborations.submitInfluencerReview(id), { reviewData });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  api
};

export default collaborationService;
