import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();

  // 로딩 중일 때는 로딩 화면 표시
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
          로딩 중...
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default PrivateRoute;