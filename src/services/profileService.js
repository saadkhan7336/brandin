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
   * Accepts JSON: about, username, category, platforms, location, portfolio, isAvailable
   */
  updateInfluencerProfile: async (data) => {

    const res = await api.patch(ENDPOINTS.influencers.update, data);
    
    return res.data.data; // { influencer, completion }
  },
};

export default profileService;