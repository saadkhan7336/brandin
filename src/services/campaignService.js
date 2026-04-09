import api from './api';

const campaignService = {
  getCampaigns: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/campaigns?${params.toString()}`);
    return response.data.data;
  },

  createCampaign: async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data.data;
  },

  updateCampaign: async (id, campaignData) => {
    const response = await api.patch(`/campaigns/${id}`, campaignData);
    return response.data.data;
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  cancelCampaign: async (id, cancelReason) => {
    const response = await api.patch(`/campaigns/${id}/cancel`, { cancelReason });
    return response.data.data;
  },

  extendCampaignDuration: async (id, newEndDate) => {
    const response = await api.patch(`/campaigns/${id}/extend?newEndDate=${newEndDate}`);
    return response.data.data;
  },

};

export default campaignService;
