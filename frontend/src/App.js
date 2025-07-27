import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import HelpPage from './pages/HelpPage';
import { UserProvider, useUser } from './contexts/UserContext';
import PrivateRoute from './components/PrivateRoute';
import { SettingsProvider } from './contexts/SettingsContext'; 

// 루트 경로를 위한 컴포넌트 - UserContext를 사용하여 로그인 상태 확인
const RootRedirect = () => {
  const { isAuthenticated, loading } = useUser();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
          로딩 중...
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserProvider>
      <SettingsProvider> 
        <Router>
          <div className="App">
            <Routes>
              {/* 공개 페이지 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/help" element={<HelpPage />} />

              {/* 보호된 대시보드 */}
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* 루트 경로 - 로그인 상태에 따라 리다이렉트 */}
              <Route path="/" element={<RootRedirect />} />
            </Routes>
          </div>
        </Router>
      </SettingsProvider>
    </UserProvider>
  );
}

export default App;
