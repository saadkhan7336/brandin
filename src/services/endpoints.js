export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  LOGOUT: "/auth/logout",
  ME: "/users/profile",
  campaigns: {
    getAll: "/campaigns",
    getOne: (id) => `/campaigns/${id}`,
    create: "/campaigns",
    update: (id) => `/campaigns/${id}`,
    delete: (id) => `/campaigns/${id}`
  },
  activities: {
    getAll: "/activities",
    markRead: (id) => `/activities/${id}/read`,
    markAllRead: "/activities/read-all",
    delete: (id) => `/activities/${id}`
  },
  collaborations: {
    getRequests: "/collaborations/request",
    acceptRequest: (id) => `/collaborations/request/${id}/accept`,
    rejectRequest: (id) => `/collaborations/request/${id}/reject`,
    cancelRequest: (id) => `/collaborations/request/${id}/cancel`,
    sendRequest: "/collaborations/request"
  }
};