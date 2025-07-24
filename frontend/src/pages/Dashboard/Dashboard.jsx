import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ReviewPage from './ReviewPage';
import ManualPage from './ManualPage';
import HistoryPage from './HistoryPage';
import SettingsPage from './SettingsPage';

function Dashboard() {
  const userId = localStorage.getItem('userId'); // 실제 로그인한 사용자 ID 사용
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/review" element={<ReviewPage userId={userId} />} />
          <Route path="/manual" element={<ManualPage userId={userId} />} />
          <Route path="/history" element={<HistoryPage userId={userId} />} />
          <Route path="/settings" element={<SettingsPage userId={userId} />} />
          <Route path="/" element={<Navigate to="/dashboard/review" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard; 