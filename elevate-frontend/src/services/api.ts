import axios from 'axios';

export const baseURL = 'http://localhost:8000';

const api = axios.create({
  baseURL: baseURL + '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة التوكن ومعرف الجهاز للطلبات
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const deviceUuid = localStorage.getItem('device_uuid');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (deviceUuid) {
    config.headers['X-Device-UUID'] = deviceUuid;
  }
  
  return config;
});

export default api;
