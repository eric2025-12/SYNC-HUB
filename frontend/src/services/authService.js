// services/authService.js
import api from './api';

/**
 * Register a new user
 * @param {Object} payload - { name, email, password, role, bio?, skills? }
 * @returns {Promise<Object>} - Response data from backend
 */
export async function register(payload) {
  try {
    // Ensure required fields are present
    const requiredFields = ['name', 'email', 'password', 'role'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw { error: `'${field}' is required for registration` };
      }
    }

    const res = await api.post('/auth/register', payload);
    return res.data;
  } catch (error) {
    // Handle API errors gracefully
    console.error('Register Error:', error.response?.data || error.message || error);
    throw error.response?.data || error;
  }
}

/**
 * Login user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} - Response data from backend
 */
export async function login(email, password) {
  if (!email || !password) {
    throw { error: 'Email and password are required for login' };
  }

  try {
    const res = await api.post('/auth/login', { email, password });

    // Save JWT token in localStorage for future requests
    if (res.data?.token) {
      localStorage.setItem('synchub_token', res.data.token);
    }

    return res.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message || error);
    throw error.response?.data || error;
  }
}

/**
 * Logout user by removing the stored token
 */
export function logout() {
  localStorage.removeItem('synchub_token');
}
