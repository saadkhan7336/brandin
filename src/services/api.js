import axios from 'axios';
import { logoutSuccess } from '../redux/slices/authSlice';

let store;
export const injectStore = _store => {
  store = _store;
};

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v1`,
    withCredentials: true 
});

let isRefreshing = false;
let failedQueue = [];

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
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
                await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v1/auth/refresh-token`, {}, { withCredentials: true });
                
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