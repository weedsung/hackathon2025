import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import HelpPage from './pages/HelpPage';

import { SettingsProvider } from './contexts/SettingsContext'; 

function App() {
  return (
    <SettingsProvider> 
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
