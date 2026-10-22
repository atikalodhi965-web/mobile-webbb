/**
 * Central Axios instance for all backend API calls.
 * Base URL comes from VITE_API_URL.
 */
import axios from 'axios';
import { API_URL } from './env';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('SAMZ_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('SAMZ_token');
      localStorage.removeItem('SAMZ_auth_user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
