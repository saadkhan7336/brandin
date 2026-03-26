import { useDispatch, useSelector } from "react-redux";
import api from "../services/api.js";
import { ENDPOINTS } from "../services/endpoints.js";
import {
  setLoading,
  setCampaigns,
  setError,
  addCampaign,
  updateCampaignInState,
  removeCampaign,
  setSelectedCampaign
} from "../redux/slices/campaignSlice.js";

export const useCampaign = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.campaign);


  // FETCH ALL CAMPAIGNS
  const fetchCampaigns = async (params = {}) => {
    try {
      dispatch(setLoading(true));

      const res = await api.get(ENDPOINTS.campaigns.getAll, {
        params: { ...filters, ...params }
      });

      dispatch(setCampaigns(res.data.data));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Error fetching campaigns"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // GET SINGLE CAMPAIGN
  const getCampaign = async (id) => {
    try {
      dispatch(setLoading(true));

      const res = await api.get(`${ENDPOINTS.campaigns.getOne}/${id}`);

      dispatch(setSelectedCampaign(res.data.data));
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // CREATE CAMPAIGN
  const createCampaign = async (data) => {
    try {
      dispatch(setLoading(true));

      const res = await api.post(
        ENDPOINTS.campaigns.create,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(addCampaign(res.data.data));
      return res.data.data;

    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // UPDATE CAMPAIGN
  const updateCampaign = async (id, data) => {
    try {
      dispatch(setLoading(true));

      const res = await api.put(
        `${ENDPOINTS.campaigns.update}/${id}`,
        data
      );

      dispatch(updateCampaignInState(res.data.data));
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // DELETE CAMPAIGN 
  const deleteCampaign = async (id) => {
    try {
      dispatch(setLoading(true));

      await api.delete(`${ENDPOINTS.campaigns.delete}/${id}`);

      dispatch(removeCampaign(id));
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    fetchCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign
  };
};