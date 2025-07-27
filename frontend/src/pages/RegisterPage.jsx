import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await register(email, password, name, department);
      setIsLoading(false);
      
      // 회원가입 성공 메시지
      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
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
            <label className="form-label">이름 *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="form-input" 
              placeholder="이름을 입력하세요" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">이메일 *</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="form-input" 
              placeholder="your@email.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호 *</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="form-input" 
              placeholder="최소 6자 이상" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호 확인 *</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              className="form-input" 
              placeholder="비밀번호를 다시 입력하세요" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">부서</label>
            <input 
              type="text" 
              value={department} 
              onChange={e => setDepartment(e.target.value)} 
              className="form-input" 
              placeholder="부서명 (선택사항)" 
            />
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
                회원가입 중...
              </>
            ) : (
              '회원가입'
            )}
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