import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  const [dbStatus, setDbStatus] = useState('unknown'); // 'connected', 'disconnected', 'unknown'

  // 데이터베이스 연결 상태 확인
  const checkDbStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setDbStatus('connected');
      } else {
        setDbStatus('disconnected');
      }
    } catch (error) {
      setDbStatus('disconnected');
    }
  }, []);

  // 사용자 로그아웃 - useCallback으로 감싸서 무한 루프 방지
  const logout = useCallback(() => {
    // localStorage 정리
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDepartment');
    
    setUser(null);
  }, []);

  // 초기 로드 시 저장된 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userDepartment = localStorage.getItem('userDepartment');

    if (token && userId) {
      // JWT 토큰 형식 검증
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          setUser({
            id: userId,
            name: userName || '',
            email: userEmail || '',
            department: userDepartment || '',
            token: token
          });
        } else {
          // 유효하지 않은 토큰이면 정리
          logout();
        }
      } catch (error) {
        // 토큰 파싱 실패 시 정리
        logout();
      }
    }
    setLoading(false);
    
    // 데이터베이스 상태 확인
    checkDbStatus();
  }, [logout, checkDbStatus]);

  // 사용자 로그인
  const login = (userData) => {
    try {
      // 입력 데이터 검증
      if (!userData || !userData.token || !userData.userId) {
        console.error('Invalid user data:', userData);
        throw new Error('유효하지 않은 사용자 데이터입니다.');
      }
      
      const userInfo = {
        id: userData.userId,
        name: userData.name || '',
        email: userData.email || '',
        department: userData.department || '',
        token: userData.token
      };
      
      // localStorage에 저장
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('userName', userData.name || '');
      localStorage.setItem('userEmail', userData.email || '');
      localStorage.setItem('userDepartment', userData.department || '');
      
      setUser(userInfo);
      console.log('User logged in successfully:', userInfo.email);
    } catch (error) {
      console.error('Login error in UserContext:', error);
      // 에러 발생 시 정리
      logout();
      throw error;
    }
  };

  // 사용자 정보 업데이트
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // localStorage도 업데이트
    if (updates.name) localStorage.setItem('userName', updates.name);
    if (updates.email) localStorage.setItem('userEmail', updates.email);
    if (updates.department) localStorage.setItem('userDepartment', updates.department);
  };

  const value = {
    user,
    loading,
    dbStatus,
    checkDbStatus,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
