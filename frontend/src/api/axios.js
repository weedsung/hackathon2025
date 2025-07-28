// src/api/axios.js
import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api' 
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 응답 시 자동 로그아웃
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userDepartment');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;