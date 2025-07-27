import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken, logout as logoutAPI } from '../api/auth';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 토큰 확인
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      const userDepartment = localStorage.getItem('userDepartment');

      if (token && userId) {
        try {
          // 토큰 검증
          const userData = await verifyToken();
          setUser({
            token,
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
            department: userData.department
          });
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          // 토큰이 유효하지 않으면 로컬 스토리지만 정리
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userDepartment');
        }
      } else if (token === 'guest-token-123' && userId === 'guest-user') {
        // 게스트 사용자
        setUser({
          token,
          userId,
          name: userName || '게스트 사용자',
          email: userEmail || 'guest@example.com',
          department: userDepartment || '게스트'
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userDepartment', userData.department);
  };

  const handleLogout = async () => {
    try {
      // 실제 로그아웃 API 호출 (선택사항)
      if (user && user.token !== 'guest-token-123') {
        await logoutAPI();
      }
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 로컬 스토리지 정리
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userDepartment');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout: handleLogout,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
