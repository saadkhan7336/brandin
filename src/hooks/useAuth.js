// import { useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import api from '../services/api';
// import { ENDPOINTS } from '../services/endpoints';
// import {
//   setAuthUser,
//   setLoading,
//   logoutSuccess,
//   setError,
//   clearAuthState
// } from '../redux/slices/authSlice';

// export const useAuth = () => {
//   const dispatch = useDispatch();
//   const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

//   const fetchUser = useCallback(async () => {
//     // Optimization: Check if we even expect a session before calling backend
//     if (localStorage.getItem('brandly_has_session') !== 'true') {
//       dispatch(logoutSuccess());
//       return;
//     }

//     try {
//       dispatch(setLoading(true));
//       const response = await api.get(ENDPOINTS.ME);
//       dispatch(setAuthUser(response.data.data));
//       localStorage.setItem('brandly_has_session', 'true');
//     } catch (err) {
//       dispatch(logoutSuccess());
//       localStorage.removeItem('brandly_has_session');
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch]);

//   const logout = useCallback(async () => {
//     try {
//       dispatch(setLoading(true));
//       await api.post(ENDPOINTS.LOGOUT);
//       dispatch(logoutSuccess());
//       dispatch(clearAuthState());
//       localStorage.removeItem('brandly_has_session');
//     } catch (err) {
//       dispatch(setError(err.response?.data?.message || "Logout failed"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch]);

//   return {
//     user,
//     isAuthenticated,
//     loading,
//     error,
//     fetchUser,
//     logout
//   };
// };


import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';
import {
  setAuthUser,
  setLoading,
  logoutSuccess,
  setError,
  clearAuthState
} from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // 🔥 Auto login
  const fetchUser = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await api.get(ENDPOINTS.ME);

      dispatch(setAuthUser(response.data.data));
      console.log(error);

    } catch (err) {
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
    logout
  };
};