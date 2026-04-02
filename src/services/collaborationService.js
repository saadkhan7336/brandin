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
  }
};

export default collaborationService;
