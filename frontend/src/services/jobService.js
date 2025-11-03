// src/services/jobService.js
import api from './api';

/**
 * Post a new job
 * @param {Object} payload - Job details (title, description, budget, etc.)
 * @returns {Object} - Response data from backend
 */
export async function postJob(payload) {
  try {
    const res = await api.post('/jobs/post', payload);
    return res.data;
  } catch (error) {
    console.error('Error posting job:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to post job');
  }
}

/**
 * List all jobs with optional query parameters
 * @param {Object} params - Query parameters (page, limit, filters)
 * @returns {Object} - Response data from backend
 */
export async function listJobs(params = {}) {
  try {
    const res = await api.get('/jobs/list', { params });
    return res.data;
  } catch (error) {
    console.error('Error listing jobs:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to list jobs');
  }
}

/**
 * Get details of a specific job
 * @param {string|number} jobId - Job ID
 * @returns {Object} - Response data from backend
 */
export async function getJob(jobId) {
  try {
    const res = await api.get(`/jobs/${jobId}`);
    return res.data; // Should contain { job: {...} } or job object
  } catch (error) {
    console.error('Error fetching job:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch job');
  }
}

/**
 * Apply to a specific job
 * @param {string|number} jobId - Job ID
 * @returns {Object} - Response data from backend
 */
export async function applyJob(jobId) {
  try {
    const res = await api.post(`/jobs/apply/${jobId}`);
    return res.data; // Should contain { message: 'Application successful' }
  } catch (error) {
    console.error('Error applying to job:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to apply for job');
  }
}
