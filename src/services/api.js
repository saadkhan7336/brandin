import axios from 'axios';
import { logoutSuccess } from '../redux/slices/authSlice';
import { setGlobalLoading } from '../redux/slices/uiSlice';

let store;
export const injectStore = _store => {
  store = _store;
};

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL || 'https://brandy-backend.onrender.com'}/api/v1`,
    withCredentials: true 
});

let isRefreshing = false;
let failedQueue = [];
let activeRequests = 0;

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// --- Request Interceptor ---
api.interceptors.request.use(
    (config) => {
        // Skip global loader for background requests (e.g., polling) if needed
        // For now, track all requests
        activeRequests++;
        if (store) {
            store.dispatch(setGlobalLoading(true));
        }
        return config;
    },
    (error) => {
        activeRequests--;
        if (activeRequests === 0 && store) {
            store.dispatch(setGlobalLoading(false));
        }
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
api.interceptors.response.use(
    (response) => {
        activeRequests--;
        if (activeRequests === 0 && store) {
            store.dispatch(setGlobalLoading(false));
        }
        return response;
    },
    async (error) => {
        activeRequests--;
        if (activeRequests === 0 && store) {
            store.dispatch(setGlobalLoading(false));
        }

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => api(originalRequest))
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use standard axios to avoid interceptor loop
                await axios.post(`${process.env.REACT_APP_API_URL || 'https://brandy-backend.onrender.com'}/api/v1/auth/refresh-token`, {}, { withCredentials: true });
                
                isRefreshing = false;
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError);
                store.dispatch(logoutSuccess());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;