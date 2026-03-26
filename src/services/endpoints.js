export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  LOGOUT: "/auth/logout",
  ME: "/auth/profile",
  campaigns: {
    getAll: "/campaigns",
    getOne: (id) => `/campaigns/${id}`,
    create: "/campaigns",
    update: (id) => `/campaigns/${id}`,
    delete: (id) => `/campaigns/${id}`
  }
};