import api from "./api"; // Assuming default axios/api instance
import { ENDPOINTS } from "./endpoints";

export const getFilteredInfluencers = async (campaignId, signal) => {
  try {
    const response = await api.get(`/aiMatch/filter/${campaignId}`, { signal });
    return response.data; // { success: true, count: 50, data: [...] }
  } catch (error) {
    if (error.name === 'CanceledError' || error.message === 'canceled') {
      console.log('AI Match request canceled');
      return null;
    }
    console.error("Error in getFilteredInfluencers:", error);
    throw error;
  }
};

export const getAiMatchForInfluencer = async (influencerId, type = 'campaigns', signal) => {
  try {
    // Calling the endpoint as requested
    const response = await api.get(`/aiMatch/ai-match-influencer/${influencerId}?type=${type}`, { signal });
    return response.data; 
  } catch (error) {
    if (error.name === 'CanceledError' || error.message === 'canceled') {
      console.log('AI Match request canceled');
      return null;
    }
    console.error("Error in getAiMatchForInfluencer:", error);
    throw error;
  }
};
