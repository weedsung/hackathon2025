// src/api/axios.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // 인증 실패 시 로그인 페이지로 리다이렉트
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userDepartment');
      window.location.href = '/login';
    } else if (error.response?.status === 409) {
      // Conflict 에러 처리 (중복 로그인 등)
      console.warn('Conflict detected:', error.response?.data?.message);
    } else if (error.response?.status === 500) {
      // 서버 오류 (데이터베이스 오류 포함)
      console.error('Server error:', error.response?.data?.message);
    } else if (error.response?.status === 404) {
      // 리소스를 찾을 수 없음
      console.warn('Resource not found:', error.response?.data?.message);
    } else if (!error.response) {
      // 네트워크 오류
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;