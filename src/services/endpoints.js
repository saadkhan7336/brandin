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
  LOGOUT: "/auth/logout",

  // User (shared)
  ME: "/users/me",            // GET  — merged user + roleProfile + completion
  USER_PROFILE: "/users/profile",       // GET  — just user doc (legacy)
  USER_UPDATE: "/users/update-profile",// PATCH — fullname, profilePic, coverPic

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


  // Collaboration
  collaborations: {
    request: "/collaborations/request",
    getAll: "/collaborations",
    getOne: (id) => `/collaborations/${id}`,
    accept: (id) => `/collaborations/requests/${id}/accept`,
    reject: (id) => `/collaborations/requests/${id}/reject`,
    cancel: (id) => `/collaborations/requests/${id}/cancel`,
  },

  // Activity / notifications
  activity: {
    getAll: "/activities",
    markRead: (id) => `/activities/${id}/read`,
  },
};