import api from './api';
import { ENDPOINTS } from './endpoints';

const activityService = {
  getActivities: async (params = {}) => {
    const response = await api.get(ENDPOINTS.activities.getAll, { params });
    return response.data;
  },

  markAsRead: async (activityId) => {
    const response = await api.patch(ENDPOINTS.activities.markRead(activityId));
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch(ENDPOINTS.activities.markAllRead);
    return response.data;
  },

  deleteActivity: async (activityId) => {
    const response = await api.delete(ENDPOINTS.activities.delete(activityId));
    return response.data;
  }
};

export default activityService;
