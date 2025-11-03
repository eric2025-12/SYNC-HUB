// src/services/api.js
import axios from 'axios';

// Base URL for API requests (from .env or fallback to localhost)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // optional: include cookies if your backend uses them
});

// Request interceptor to attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('synchub_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API Error [${error.response.status}]:`,
        error.response.data || error.message
      );
    } else {
      console.error('API Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
