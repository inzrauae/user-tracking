import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  demoLogin: (role: string) => 
    api.post('/auth/demo-login', { role }),
  
  logout: (userId: string) => 
    api.post('/auth/logout', { userId }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  
  getById: (id: string) => api.get(`/users/${id}`),
  
  update: (id: string, data: any) => 
    api.put(`/users/${id}`, data),
  
  updateActivity: (id: string, isOnline: boolean) => 
    api.post(`/users/${id}/activity`, { isOnline }),
  
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params?: any) => api.get('/tasks', { params }),
  
  getById: (id: string) => api.get(`/tasks/${id}`),
  
  create: (taskData: any) => api.post('/tasks', taskData),
  
  update: (id: string, taskData: any) => 
    api.put(`/tasks/${id}`, taskData),
  
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Time Entries API
export const timeEntriesAPI = {
  getAll: (params?: any) => api.get('/time-entries', { params }),
  
  getActive: (userId: string) => 
    api.get(`/time-entries/active/${userId}`),
  
  start: (userId: string, taskId?: string) => 
    api.post('/time-entries/start', { userId, taskId }),
  
  update: (id: string, data: any) => 
    api.put(`/time-entries/${id}`, data),
  
  stop: (id: string) => 
    api.post(`/time-entries/stop/${id}`),
  
  getSummary: (userId: string, date?: string) => 
    api.get(`/time-entries/summary/${userId}`, { params: { date } }),
};

// Screenshots API
export const screenshotsAPI = {
  getAll: (params?: any) => api.get('/screenshots', { params }),
  
  getUserScreenshots: (userId: string, limit?: number) => 
    api.get(`/screenshots/user/${userId}`, { params: { limit } }),
  
  create: (screenshotData: any) => 
    api.post('/screenshots', screenshotData),
  
  delete: (id: string) => api.delete(`/screenshots/${id}`),
};

// Stats API
export const statsAPI = {
  getDashboard: (userId: string) => 
    api.get(`/stats/dashboard/${userId}`),
  
  getWeekly: (userId: string) => 
    api.get(`/stats/weekly/${userId}`),
  
  getTeam: () => api.get('/stats/team'),
};

export default api;
