// frontend/src/services/api.js
// Purpose: Axios instance — base URL, token injection, global 401/403 handling
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach JWT ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: handle auth errors globally ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('sms_token');
      localStorage.removeItem('sms_user');
      window.location.href = '/login';
    }
    if (status === 403) {
      window.location.href = '/unauthorized';
    }
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
