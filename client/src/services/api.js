import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Interceptor to attach Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('solar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth APIs
export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const registerApi = (userData) => API.post('/auth/register', userData);
export const getProfileApi = () => API.get('/auth/profile');
export const updateProfileApi = (data) => API.put('/auth/profile', data);
export const changePasswordApi = (data) => API.put('/auth/change-password', data);

// Solar Panel APIs
export const fetchPanelsApi = (params) => API.get('/panels', { params });
export const fetchPanelByIdApi = (id) => API.get(`/panels/${id}`);
export const createPanelApi = (panelData) => API.post('/panels', panelData);
export const updatePanelApi = (id, panelData) => API.put(`/panels/${id}`, panelData);
export const deletePanelApi = (id) => API.delete(`/panels/${id}`);

// Sensor Telemetry APIs
export const fetchSensorHistoryApi = (params) => API.get('/sensor-data/history', { params });
export const pushTelemetryTickApi = (tickData) => API.post('/sensor-data/tick', tickData);

// Maintenance APIs
export const fetchMaintenanceApi = () => API.get('/maintenance');
export const createMaintenanceApi = (data) => API.post('/maintenance', data);
export const updateMaintenanceApi = (id, data) => API.put(`/maintenance/${id}`, data);
export const deleteMaintenanceApi = (id) => API.delete(`/maintenance/${id}`);

// Alert APIs
export const fetchAlertsApi = (params) => API.get('/alerts', { params });
export const createAlertApi = (data) => API.post('/alerts', data);
export const updateAlertStatusApi = (id, status) => API.put(`/alerts/${id}/status`, { status });

// Report APIs
export const fetchReportsApi = () => API.get('/reports');
export const generateReportApi = (data) => API.post('/reports/generate', data);

// Dashboard & Analytics APIs
export const fetchDashboardStatsApi = () => API.get('/dashboard/stats');
export const fetchAnalyticsApi = (params) => API.get('/dashboard/analytics', { params });

export default API;
