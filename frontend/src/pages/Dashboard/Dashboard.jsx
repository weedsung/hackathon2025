import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ReviewPage from './ReviewPage';
import ManualPage from './ManualPage';
import HistoryPage from './HistoryPage';
import SettingsPage from './SettingsPage';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/manual" element={<ManualPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/dashboard/review" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard; 