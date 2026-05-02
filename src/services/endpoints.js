// export const ENDPOINTS = {
//   LOGIN: "/auth/login",
//   REGISTER: "/auth/register",
//   FORGOT_PASSWORD: "/auth/forgot-password",
//   RESET_PASSWORD: "/auth/reset-password",
//   LOGOUT: "/auth/logout",
//   ME: "/users/profile",
//   campaigns: {
//     getAll: "/campaigns",
//     getOne: (id) => `/campaigns/${id}`,
//     create: "/campaigns",
//     update: (id) => `/campaigns/${id}`,
//     delete: (id) => `/campaigns/${id}`
//   },
//   explore: {
//     campaigns: "/explore/campaigns",
//     brands: "/explore/brands",
//   },
// };




// export const ENDPOINTS = {
//   LOGIN: "/auth/login",
//   REGISTER: "/auth/register",
//   FORGOT_PASSWORD: "/auth/forgot-password",
//   RESET_PASSWORD: "/auth/reset-password",
//   LOGOUT: "/auth/logout",
//   ME: "/users/profile",

//   campaigns: {
//     getAll: "/campaigns",
//     getOne: (id) => `/campaigns/${id}`,
//     create: "/campaigns",
//     update: (id) => `/campaigns/${id}`,
//     delete: (id) => `/campaigns/${id}`,
//     apply: (id) => `/campaigns/${id}/apply`,
//   },

//   brands: {
//     publicProfile: (id) => `/brands/${id}/public`,
//     publicList: "/brands/public-list",
//     dashboard: "/brands/dashboard",
//     profile: "/brands/profile",
//     update: "/brands/update-profile",
//   },

//   influencers: {
//     search: "/influencers/search",
//     getOne: (id) => `/influencers/${id}`,
//     dashboard: "/influencers/dashboard",
//     profile: "/influencers/profile",
//     update: "/influencers/update-profile",
//   },
// };


// src/services/endpoints.js
export const ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",
  LOGOUT: "/auth/logout",
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",

  // User (shared)
  ME: "/users/me",            // GET  — merged user + roleProfile + completion
  USER_PROFILE: "/users/profile",       // GET  — just user doc (legacy)
  USER_UPDATE: "/users/update-profile",// PATCH — fullname, profilePic, coverPic
  USER_DELETE: "/users", // DELETE — permanent account deletion
  USER_DEACTIVATE: "/users/deactivate", // PATCH — temporary account deactivation

  // Campaigns
  campaigns: {
    getAll: "/campaigns",
    getOne: (id) => `/campaigns/${id}`,
    create: "/campaigns",
    update: (id) => `/campaigns/${id}`,
    delete: (id) => `/campaigns/${id}`,
    apply: (id) => `/campaigns/${id}/apply`,
  },

  // Brands
  brands: {
    dashboard: "/brands/dashboard",
    profile: "/brands/profile",
    update: "/brands/update-profile",
    publicProfile: (id) => `/brands/${id}/public`,
    publicList: "/brands/public-list",
  },

  // Influencers
  influencers: {
    dashboard: "/influencers/dashboard",
    profile: "/influencers/profile",
    update: "/influencers/update-profile",
    search: "/influencers/search",
    getOne: (id) => `/influencers/${id}`,
  },

  // Activities / Notifications
  activities: {
    getAll: "/activities",
    markRead: (id) => `/activities/${id}/read`,
    markAllRead: "/activities/read-all",
    delete: (id) => `/activities/${id}`
  },

  // Collaborations
  collaborations: {
    getRequests: "/collaborations/request",
    sendRequest: "/collaborations/request",
    acceptRequest: (id) => `/collaborations/request/${id}/accept`,
    rejectRequest: (id) => `/collaborations/request/${id}/reject`,
    cancelRequest: (id) => `/collaborations/request/${id}/cancel`,
    counterOffer: (id) => `/collaborations/request/${id}/counter-offer`,
    getAll: "/collaborations",
    getOne: (id) => `/collaborations/${id}`,
    getLatestWithUser: (otherUserId) => `/collaborations/latest/${otherUserId}`,
    addDeliverable: (id) => `/collaborations/${id}/deliverables`,
    updateDeliverable: (id, delivId) => `/collaborations/${id}/deliverables/${delivId}`,
    deleteDeliverable: (id, delivId) => `/collaborations/${id}/deliverables/${delivId}`,
    submitDeliverable: (id, delivId) => `/collaborations/${id}/deliverables/${delivId}/submit`,
    reviewDeliverable: (id, delivId) => `/collaborations/${id}/deliverables/${delivId}/review`,
    pause: (id) => `/collaborations/${id}/pause`,
    resume: (id) => `/collaborations/${id}/resume`,
    suspend: (id) => `/collaborations/${id}/suspend`,
    complete: (id) => `/collaborations/${id}/complete`,
    requestAction: (id) => `/collaborations/${id}/request-action`,
    handleAction: (id) => `/collaborations/${id}/handle-action`,
    submitInfluencerReview: (id) => `/collaborations/${id}/influencer-review`,
  },

  // Messages
  messages: {
    getConversations: "/messages/conversations",
    createConversation: "/messages/conversations",
    getMessages: (id) => `/messages/${id}`,
    sendMessage: "/messages",
    markAsRead: (id) => `/messages/${id}/read`,
  },

  // OAuth Platform Verification
  oauth: {
    status: "/oauth/status",
    simulate: (platform) => `/oauth/${platform}/simulate`,
    revoke: (platform) => `/oauth/${platform}/revoke`,
    // connect is a full-page redirect (not an API call), so we use the backend URL directly
    connectUrl: (platform) => `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v1/oauth/${platform}/connect`,
  },
};