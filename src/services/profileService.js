// src/services/profileService.js
import api from "./api";
import { ENDPOINTS } from "./endpoints";

const profileService = {
  /**
   * GET /users/me
   * Returns: { user, roleProfile, completion }
   */
  getMe: async () => {
    const res = await api.get(ENDPOINTS.ME);
    
    return res.data.data;
  },

  /**
   * PATCH /users/update-profile
   * Accepts FormData: fullname, profilePic (file), coverPic (file)
   */
  updateUserInfo: async (formData) => {
    const res = await api.patch(ENDPOINTS.USER_UPDATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data; // { user, completion }
  },

  /**
   * PATCH /brands/update-profile
   * Accepts FormData: brandname, industry, description, budgetRange, website, address, logo (file)
   */
  updateBrandProfile: async (formData) => {
    const res = await api.patch(ENDPOINTS.brands.update, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data; // { brand, completion }
  },

  /**
   * PATCH /influencers/update-profile
   * Accepts JSON or FormData
   */
  updateInfluencerProfile: async (data) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    const res = await api.patch(ENDPOINTS.influencers.update, data, config);
    
    return res.data.data; // { influencer, completion }
  },

  /**
   * POST /auth/change-password
   */
  changePassword: async (oldPassword, newPassword) => {
    const res = await api.post(ENDPOINTS.CHANGE_PASSWORD, { oldPassword, newPassword });
    return res.data;
  },

  /**
   * DELETE /users
   */
  deleteAccount: async () => {
    const res = await api.delete(ENDPOINTS.USER_DELETE);
    return res.data;
  },

  /**
   * PATCH /users/deactivate
   */
  deactivateAccount: async () => {
    const res = await api.patch(ENDPOINTS.USER_DEACTIVATE);
    return res.data;
  },
};

export default profileService;