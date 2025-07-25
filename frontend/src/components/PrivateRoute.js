// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// 인증 여부를 localStorage의 토큰으로 체크
const isAuthenticated = () => {
  // 실제 서비스에서는 토큰의 유효성(만료, 변조 등)까지 검증해야 함
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;