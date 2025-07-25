import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: '✍️',
      label: '메일 작성',
      path: '/dashboard/compose',
      description: 'AI 도움으로 이메일 작성'
    },
    {
      icon: '📨',
      label: '메일 검토',
      path: '/dashboard/review',
      description: '이메일 오해 여부 검토'
    },
    {
      icon: '📝',
      label: '답장 메뉴얼',
      path: '/dashboard/manual',
      description: 'AI 추천 답장 예시'
    },
    {
      icon: '📂',
      label: '대화 히스토리',
      path: '/dashboard/history',
      description: '이전 메일 검색 및 재사용'
    },
    {
      icon: '⚙️',
      label: '내 설정',
      path: '/dashboard/settings',
      description: '알림 설정, 톤 설정 등'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleHelp = () => {
    navigate('/help');
  };

  return (
    <div className="sidebar">
      {/* 헤더 */}
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          📧 AI 어시스턴트
        </h1>
        <p className="sidebar-subtitle">
          이메일 커뮤니케이션 도구
        </p>
      </div>

      {/* 메뉴 아이템들 */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = isActivePath(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleMenuClick(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-content">
                <div className="nav-label">
                  {item.label}
                </div>
                <div className="nav-desc">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 하단 버튼들 */}
      <div className="sidebar-footer">
        <button
          onClick={handleHelp}
          className="nav-item"
          style={{ marginBottom: '8px' }}
        >
          <span className="nav-icon">❓</span>
          <span className="nav-label">도움말</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ color: '#d32f2f' }}
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-label">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 