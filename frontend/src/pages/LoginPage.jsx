import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useUser } from '../contexts/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: userLogin } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with email:', email);
      const data = await login(email, password);
      console.log('Login API response:', data);
      
      // 로그인 성공 처리 - UserContext 사용
      userLogin(data);
      console.log('User context updated, navigating to dashboard...');
      
      setIsLoading(false);
      
      // 약간의 지연 후 네비게이션 (상태 업데이트 완료 대기)
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = '로그인 실패';
      
      if (err.response?.status === 409) {
        errorMessage = err.response?.data?.message || '이미 로그인된 계정입니다.';
      } else if (err.response?.status === 401) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">
            📧 이메일 AI 어시스턴트
          </h1>
          <p className="login-subtitle">
            더 나은 이메일 커뮤니케이션을 위한 AI 도구
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이메일</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
                📧
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ fontSize: '14px', color: '#666' }}>
            계정이 없으신가요?{' '}
            <button 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1976d2', 
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => navigate('/register')}
            >
              회원가입
            </button>
          </p>
          
          {/* 테스트용 게스트 로그인 버튼 */}
          {/*
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
            <button
              onClick={handleGuestLogin}
              className="btn btn-secondary"
              style={{ 
                width: '100%',
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: '1px solid #ddd'
              }}
            >
              🚀 계정없이 이용하기 (테스트용)
            </button>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              * 개발/테스트 목적으로만 사용하세요
            </p>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 