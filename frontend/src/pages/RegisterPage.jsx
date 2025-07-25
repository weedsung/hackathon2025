import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await register(email, password, name, department);
      setIsLoading(false);
      // 회원가입 성공 시 userId 저장 (백엔드에서 userId 반환한다고 가정)
      if (data && data.userId) {
        localStorage.setItem('userId', data.userId);
      }
      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 실패');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">회원가입</h1>
          <p className="login-subtitle">아래 정보를 입력해 회원가입을 진행하세요.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이름</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="이름" required />
          </div>
          <div className="form-group">
            <label className="form-label">이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="비밀번호" required />
          </div>
          <div className="form-group">
            <label className="form-label">부서</label>
            <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="form-input" placeholder="부서" required />
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {isLoading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p style={{ fontSize: '14px', color: '#666' }}>
            이미 계정이 있으신가요?{' '}
            <button 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1976d2', 
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 