import api from './api'

export async function postJob(payload) {
  const res = await api.post('/jobs/post', payload)
  return res.data
}

export async function listJobs(params = {}) {
  const res = await api.get('/jobs/list', { params })
  return res.data
}

export async function getJob(jobId) {
  const res = await api.get(`/jobs/${jobId}`)
  return res.data
}

export async function applyJob(jobId) {
  const res = await api.post(`/jobs/apply/${jobId}`)
  return res.data
}
