import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 임시로 모든 로그인을 성공으로 처리 (추후 백엔드 연동 시 수정)
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
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
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 