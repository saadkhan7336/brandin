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

  api
};

export default collaborationService;
