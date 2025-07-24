import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import HelpPage from './pages/HelpPage';
import { UserProvider } from './contexts/UserContext';
import PrivateRoute from './components/PrivateRoute';

console.log('PrivateRoute:', PrivateRoute);
console.log('RegisterPage:', RegisterPage);

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 공개 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* 보호된 대시보드 (임시로 PrivateRoute 없이 바로 렌더) */}
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* 기본 경로 → 로그인 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
