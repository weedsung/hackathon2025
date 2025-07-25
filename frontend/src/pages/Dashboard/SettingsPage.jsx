import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { fetchUserSettings, saveUserSettings } from '../../api/user';
import api from '../../api/axios';

const defaultSettings = {
  name: '',
  email: '',
  department: '',
  defaultTone: 'polite',
  emailNotifications: true, // 이메일 알림 ON
  browserNotifications: true, // 브라우저 알림 ON
  weeklyReport: true, // 주간 리포트 ON
  analysisLevel: 'detailed',
  autoCorrection: true,
  saveHistory: true,
  dataRetention: '30'
};

const SettingsPage = ({ userId }) => {
  const { settings: contextSettings, setSettings: setContextSettings } = useSettings();
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    // 1. 프로필 정보 불러오기
    api.get('/user/me').then(res => {
      setSettings(prev => ({
        ...prev,
        name: res.data.name || '',
        email: res.data.email || '',
        department: res.data.department || ''
      }));
    });
    // 2. 기존 설정 불러오기
    fetchUserSettings(userId)
      .then((data) => {
        if (data && typeof data === 'object') setSettings(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, [userId]);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Context도 함께 업데이트
    setContextSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      setError('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await saveUserSettings(userId, settings);
      setSaveMessage('설정이 저장되었습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setError('설정 저장 실패');
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = () => {
    // 임시 데이터 내보내기 기능
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-assistant-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 토글 스위치 컴포넌트
  const ToggleSwitch = ({ checked, onChange }) => (
    <label style={{ 
      position: 'relative', 
      display: 'inline-block', 
      width: '48px', 
      height: '24px',
      cursor: 'pointer'
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#2196F3' : '#ccc',
        borderRadius: '24px',
        transition: '0.4s'
      }}>
        <span style={{
          position: 'absolute',
          content: '""',
          height: '18px',
          width: '18px',
          left: '3px',
          bottom: '3px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: '0.4s',
          transform: checked ? 'translateX(24px)' : 'translateX(0)'
        }} />
      </span>
    </label>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⚙️ 설정</h1>
        <p className="page-description">
          이메일 어시스턴트의 개인 설정을 관리합니다.
        </p>
      </div>

      <div className="settings-container">
        {/* 프로필 설정 */}
        <div className="settings-section">
          <h3>👤 프로필 정보</h3>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>부서</label>
            <input
              type="text"
              value={settings.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="부서를 입력하세요"
            />
          </div>
        </div>

        {/* 이메일 분석 설정 */}
        <div className="settings-section">
          <h3>📧 이메일 분석 설정</h3>
          <div className="form-group">
            <label>기본 톤</label>
            <select
              value={settings.defaultTone}
              onChange={(e) => handleInputChange('defaultTone', e.target.value)}
            >
              <option value="polite">정중한</option>
              <option value="friendly">친근한</option>
              <option value="formal">공식적인</option>
              <option value="casual">일상적인</option>
            </select>
          </div>
          <div className="form-group">
            <label>분석 수준</label>
            <select
              value={settings.analysisLevel}
              onChange={(e) => handleInputChange('analysisLevel', e.target.value)}
            >
              <option value="basic">기본</option>
              <option value="detailed">상세</option>
              <option value="comprehensive">종합</option>
            </select>
          </div>
          <div className="form-group">
            <label className="toggle-label">
              자동 수정 제안
              <ToggleSwitch
                checked={settings.autoCorrection}
                onChange={(e) => handleInputChange('autoCorrection', e.target.checked)}
              />
            </label>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="settings-section">
          <h3>🔔 알림 설정</h3>
          <div className="form-group">
            <label className="toggle-label">
              이메일 알림
              <ToggleSwitch
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="toggle-label">
              브라우저 알림
              <ToggleSwitch
                checked={settings.browserNotifications}
                onChange={(e) => handleInputChange('browserNotifications', e.target.checked)}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="toggle-label">
              주간 리포트
              <ToggleSwitch
                checked={settings.weeklyReport}
                onChange={(e) => handleInputChange('weeklyReport', e.target.checked)}
              />
            </label>
          </div>
        </div>

        {/* 데이터 관리 */}
        <div className="settings-section">
          <h3>💾 데이터 관리</h3>
          <div className="form-group">
            <label className="toggle-label">
              히스토리 저장
              <ToggleSwitch
                checked={settings.saveHistory}
                onChange={(e) => handleInputChange('saveHistory', e.target.checked)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>데이터 보관 기간</label>
            <select
              value={settings.dataRetention}
              onChange={(e) => handleInputChange('dataRetention', e.target.value)}
            >
              <option value="7">7일</option>
              <option value="30">30일</option>
              <option value="90">90일</option>
              <option value="365">1년</option>
            </select>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="settings-actions">
          {error && <div className="error-message">{error}</div>}
          {saveMessage && <div className="success-message">{saveMessage}</div>}
          
          <div className="button-group">
            <button
              className="btn btn-secondary"
              onClick={exportData}
              disabled={isSaving}
            >
              설정 내보내기
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '저장 중...' : '설정 저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 