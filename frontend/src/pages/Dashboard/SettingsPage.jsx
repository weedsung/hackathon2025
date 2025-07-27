import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { fetchUserSettings, saveUserSettings, updateUserProfile } from '../../api/user';
import { useUser } from '../../contexts/UserContext';

const defaultSettings = {
  name: '',
  email: '',
  department: '',
  defaultTone: 'polite',
  emailNotifications: true,
  browserNotifications: true,
  weeklyReport: true,
  analysisLevel: 'detailed',
  autoCorrection: true,
  saveHistory: true,
  dataRetention: '30'
};

const SettingsPage = () => {
  const { user, updateUser } = useUser();
  const { setSettings: setContextSettings } = useSettings();
  const [settings, setSettings] = useState({ ...defaultSettings });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    // 1. 프로필 정보 설정
    setSettings(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      department: user.department || ''
    }));

    // 2. 기존 설정 불러오기
    fetchUserSettings()
      .then((data) => {
        if (data && typeof data === 'object') setSettings(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, [user]);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setContextSettings(prev => ({ ...prev, [key]: value }));

    if (['name', 'email', 'department'].includes(key)) {
      updateUser({ [key]: value });
    }
  };

  const handleSave = async () => {
    if (!user) {
      setError('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const profileData = {
        name: settings.name,
        email: settings.email,
        department: settings.department
      };

      const settingsData = {
        defaultTone: settings.defaultTone,
        emailNotifications: settings.emailNotifications,
        browserNotifications: settings.browserNotifications,
        weeklyReport: settings.weeklyReport,
        analysisLevel: settings.analysisLevel,
        autoCorrection: settings.autoCorrection,
        saveHistory: settings.saveHistory,
        dataRetention: settings.dataRetention
      };

      await updateUserProfile(profileData);
      await saveUserSettings(settingsData);

      setSaveMessage('설정이 저장되었습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setError('설정 저장 실패');
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = () => {
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
        backgroundColor: checked ? '#1976d2' : '#ccc',
        borderRadius: '24px',
        transition: 'all 0.3s'
      }}>
        <span style={{
          position: 'absolute',
          height: '20px',
          width: '20px',
          left: checked ? '26px' : '2px',
          bottom: '2px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: 'all 0.3s'
        }}></span>
      </span>
    </label>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⚙️ 내 설정</h1>
        <p className="page-description">
          개인화된 이메일 어시스턴트 환경을 설정하세요.
        </p>
      </div>

      <div>
        {/* 프로필 설정 */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '20px' }}>👤</span>
            <h2 className="card-title">프로필 설정</h2>
          </div>
          <div className="grid grid-2 gap-4">
            <div className="form-group">
              <label className="form-label">이름</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">이메일</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">부서</label>
              <input
                type="text"
                value={settings.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* 이메일 톤 설정 */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '20px' }}>🎨</span>
            <h2 className="card-title">이메일 톤 설정</h2>
          </div>
          <div className="form-group">
            <label className="form-label">기본 어조</label>
            <div className="grid grid-3 gap-4">
              {[
                { value: 'polite', label: '정중하게', desc: '공손하고 예의바른 톤' },
                { value: 'friendly', label: '친근하게', desc: '따뜻하고 친밀한 톤' },
                { value: 'professional', label: '전문적으로', desc: '간결하고 비즈니스적인 톤' }
              ].map(tone => (
                <div
                  key={tone.value}
                  onClick={() => handleInputChange('defaultTone', tone.value)}
                  style={{
                    padding: '16px',
                    border: `2px solid ${settings.defaultTone === tone.value ? '#1976d2' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: settings.defaultTone === tone.value ? '#e3f2fd' : 'white'
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>{tone.label}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{tone.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '20px' }}>🔔</span>
            <h2 className="card-title">알림 설정</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { key: 'emailNotifications', label: '이메일 알림', desc: '분석 완료 시 이메일로 알림' },
              { key: 'browserNotifications', label: '브라우저 알림', desc: '실시간 브라우저 알림' },
              { key: 'weeklyReport', label: '주간 리포트', desc: '매주 사용 현황 요약 리포트' }
            ].map(item => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{item.desc}</div>
                </div>
                <ToggleSwitch
                  checked={settings[item.key]}
                  onChange={(e) => handleInputChange(item.key, e.target.checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI 분석 설정 */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '20px' }}>🤖</span>
            <h2 className="card-title">AI 분석 설정</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">분석 레벨</label>
              <select
                value={settings.analysisLevel}
                onChange={(e) => handleInputChange('analysisLevel', e.target.value)}
                className="form-select"
              >
                <option value="basic">기본 - 오해 소지만 검토</option>
                <option value="detailed">상세 - 감정, 톤, 오해 소지 종합 분석</option>
                <option value="advanced">고급 - 문맥, 관계성까지 고려한 심화 분석</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>자동 수정 제안</div>
                <div style={{ fontSize: '14px', color: '#666' }}>AI가 문제점을 발견하면 자동으로 수정안 제시</div>
              </div>
              <ToggleSwitch
                checked={settings.autoCorrection}
                onChange={(e) => handleInputChange('autoCorrection', e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* 데이터 관리 */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '20px' }}>💾</span>
            <h2 className="card-title">데이터 관리</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="flex justify-between items-center">
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>히스토리 저장</div>
                <div style={{ fontSize: '14px', color: '#666' }}>이메일 분석 기록을 저장하여 재사용 가능</div>
              </div>
              <ToggleSwitch
                checked={settings.saveHistory}
                onChange={(e) => handleInputChange('saveHistory', e.target.checked)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">데이터 보관 기간</label>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleInputChange('dataRetention', e.target.value)}
                className="form-select"
                disabled={!settings.saveHistory}
                style={{ opacity: settings.saveHistory ? 1 : 0.6 }}
              >
                <option value="7">7일</option>
                <option value="30">30일</option>
                <option value="90">90일</option>
                <option value="365">1년</option>
              </select>
            </div>
            <div style={{ paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
              <button
                onClick={exportData}
                className="btn btn-secondary"
                style={{ marginBottom: '8px' }}
              >
                💾 데이터 내보내기
              </button>
              <p style={{ fontSize: '12px', color: '#666' }}>
                개인 설정과 히스토리를 JSON 파일로 다운로드합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-between items-center" style={{ paddingTop: '24px' }}>
          {saveMessage && <div style={{ color: '#4caf50', fontWeight: '500' }}>{saveMessage}</div>}
          {error && <div style={{ color: '#f44336', fontWeight: '500' }}>{error}</div>}
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-success"
            >
              {isSaving ? (
                <>
                  <div className="loading-spinner"></div>
                  저장 중...
                </>
              ) : (
                <>💾 설정 저장</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
