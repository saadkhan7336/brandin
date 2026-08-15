import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';
import {
  setAuthUser,
  setLoading,
  logoutSuccess,
  setError,
  clearAuthState,
  updateUserFields
} from '../redux/slices/authSlice';
import { setProfileData } from '../redux/slices/Profileslice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const fetchUser = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await api.get(ENDPOINTS.ME);
      const { user, roleProfile, completion } = response.data.data;
      dispatch(setAuthUser(user));
      dispatch(setProfileData({ roleProfile, completion }));
    } catch (err) {
      dispatch(logoutSuccess());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await api.post(ENDPOINTS.LOGOUT);
      dispatch(logoutSuccess());
      dispatch(clearAuthState());
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Logout failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    fetchUser,
    logout,
    updateStatus: async (newStatus) => {
      try {
        dispatch(updateUserFields({ status: newStatus }));
        await api.patch('/users/status', { status: newStatus });
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    }
  };
};
