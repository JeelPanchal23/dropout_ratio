import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edushield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

export const studentAPI = {
  getMeStudent: () => api.get('/students/me'),
  getStudents: (params) => api.get('/students', { params }),
  getStudentById: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  
  uploadDocument: (id, formData) => api.post(`/students/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadCertificate: (id, formData) => api.post(`/students/${id}/certificates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFile: (id, fileId, fileType = 'document') => api.delete(`/students/${id}/documents/${fileId}?fileType=${fileType}`)
};

export const predictionAPI = {
  createPrediction: (data) => api.post('/predictions', data),
  getStudentPredictions: (studentId) => api.get(`/predictions/${studentId}`)
};

export const interventionAPI = {
  getInterventions: (params) => api.get('/interventions', { params }),
  createIntervention: (data) => api.post('/interventions', data),
  updateIntervention: (id, data) => api.put(`/interventions/${id}`, data)
};

export const csvAPI = {
  importCSV: (students) => api.post('/students/import', { students })
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
};

export const reportsAPI = {
  getOverview: () => api.get('/reports/overview')
};

export const auditAPI = {
  getAuditLogs: (params) => api.get('/audit-logs', { params })
};

export default api;
