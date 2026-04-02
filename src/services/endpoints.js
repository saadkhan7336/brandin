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
    delete: (id) => `/campaigns/${id}`,
    apply: (id) => `/campaigns/${id}/apply`,
  },

  brands: {
    publicProfile: (id) => `/brands/${id}/public`,
    publicList: "/brands/public-list",
    dashboard: "/brands/dashboard",
    profile: "/brands/profile",
    update: "/brands/update-profile",
  },

  influencers: {
    search: "/influencers/search",
    getOne: (id) => `/influencers/${id}`,
    dashboard: "/influencers/dashboard",
    profile: "/influencers/profile",
    update: "/influencers/update-profile",
  },
};