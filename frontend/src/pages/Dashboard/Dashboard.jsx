import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ComposePage from './ComposePage';
import HistoryPage from './HistoryPage';
import ReviewPage from './ReviewPage';
import ManualPage from './ManualPage';
import SettingsPage from './SettingsPage';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 사이드바 */}
      <Sidebar />
      
      {/* 메인 콘텐츠 영역 */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        backgroundColor: '#f5f5f5'
      }}>
        <Routes>
          <Route path="/" element={<ComposePage />} />
          <Route path="/compose" element={<ComposePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/manual" element={<ManualPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard; 