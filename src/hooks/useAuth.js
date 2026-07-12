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



  /**
   * 
    * fetchUser — called on app mount (App.js useEffect).
    * Calls GET /users/me which returns { user, roleProfile, completion }.
    * Stores the full user (including profileComplete) in authSlice
    * and completion/roleProfile in profileSlice.
    */
  const fetchUser = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await api.get(ENDPOINTS.ME);
      const { user, roleProfile, completion } = response.data.data;

      // Store user doc (includes profileComplete) in auth state
      dispatch(setAuthUser(user));

      // Store role profile + completion in profile slice
      dispatch(setProfileData({ roleProfile, completion }));

    } catch (err) {
      // Session expired or not logged in — clear auth state
      dispatch(logoutSuccess());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);



  // 🔥 Logout
  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      await api.post(ENDPOINTS.LOGOUT);

      dispatch(logoutSuccess());
      dispatch(clearAuthState());

    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Logout failed"));
      console.log(err);
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