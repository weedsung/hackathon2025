import React, { useState, useEffect } from 'react';
import { fetchHistory } from '../../api/history';

const defaultHistoryData = [
  {
    id: 1,
    type: 'review',
    title: '프로젝트 일정 연기 요청 메일',
    content: '안녕하세요. 현재 진행 중인 프로젝트의 일정 조정이 필요하여 연락드립니다...',
    recipient: '김팀장님',
    date: '2024-01-15',
    time: '14:30',
    score: 92,
    status: 'sent'
  },
  {
    id: 2,
    type: 'manual',
    title: '회의 일정 조율 메일',
    content: '안녕하세요. 다음 주 팀 회의 일정을 조율하고자 합니다...',
    recipient: '개발팀 전체',
    date: '2024-01-14',
    time: '11:15',
    template: '회의 일정 조율',
    status: 'sent'
  },
  {
    id: 3,
    type: 'review',
    title: '급히 확인 요청 메일',
    content: '급히 확인해주세요. 프로젝트 관련 중요한 이슈가 발생했습니다...',
    recipient: '박과장님',
    date: '2024-01-13',
    time: '16:45',
    score: 65,
    status: 'draft'
  },
  {
    id: 4,
    type: 'review',
    title: '업무 협조 요청',
    content: '안녕하세요. 현재 담당하고 있는 업무에서 도움이 필요하여 연락드립니다...',
    recipient: '이대리님',
    date: '2024-01-12',
    time: '09:20',
    score: 88,
    status: 'sent'
  },
  {
    id: 5,
    type: 'manual',
    title: '늦은 응답 사과 메일',
    content: '안녕하세요. 늦은 답변으로 인해 불편을 드려 죄송합니다...',
    recipient: '최부장님',
    date: '2024-01-11',
    time: '13:55',
    template: '늦은 응답 사과',
    status: 'sent'
  }
];

function HistoryPage({ userId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [historyData, setHistoryData] = useState(defaultHistoryData);
  // const userId = 1; // 예시: 실제 서비스에서는 로그인 정보에서 받아야 함
  // const userId = localStorage.getItem('userId'); // 실제 로그인한 사용자 ID 사용

  useEffect(() => {
    if (!userId) return; // userId 없으면 호출하지 않음
    fetchHistory(userId)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setHistoryData(data);
      })
      .catch(() => {
        // 에러 발생 시 아무것도 하지 않음(기존 데이터 유지)
      });
  }, [userId]);

  const filters = [
    { id: 'all', name: '전체', count: 15 },
    { id: 'reviewed', name: '검토함', count: 8 },
    { id: 'manual', name: '템플릿 사용', count: 5 },
    { id: 'recent', name: '최근 7일', count: 3 }
  ];

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'reviewed') matchesFilter = item.type === 'review';
    if (selectedFilter === 'manual') matchesFilter = item.type === 'manual';
    if (selectedFilter === 'recent') {
      const itemDate = new Date(item.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesFilter = itemDate >= weekAgo;
    }

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'sent': 
        return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
      case 'draft': 
        return { backgroundColor: '#fff3e0', color: '#ef6c00' };
      default: 
        return { backgroundColor: '#f0f0f0', color: '#666' };
    }
  };

  const getTypeIcon = (type) => {
    return type === 'review' ? '🔍' : '📝';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📂 대화 히스토리</h1>
        <p className="page-description">
          이전에 주고받은 이메일 기록을 확인하고 재사용할 수 있습니다.
        </p>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="card mb-4">
        <div className="grid grid-2 gap-4 mb-4">
          {/* 검색창 */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="제목, 내용, 수신자로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* 날짜 필터 */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
              📅
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {/* 필터 버튼들 */}
        <div className="flex items-center gap-4">
          <span style={{ fontSize: '16px' }}>🏷️</span>
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`btn ${selectedFilter === filter.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '14px' }}
            >
              {filter.name} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* 히스토리 목록 */}
      <div>
        {filteredHistory.map(item => (
          <div key={item.id} className="card" style={{ marginBottom: '16px' }}>
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-4 mb-4">
                  <span style={{ fontSize: '24px' }}>{getTypeIcon(item.type)}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{item.title}</h3>
                  <span 
                    style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      ...getStatusStyle(item.status)
                    }}
                  >
                    {item.status === 'sent' ? '발송됨' : '임시저장'}
                  </span>
                  {item.type === 'review' && item.score && (
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      fontSize: '12px',
                      borderRadius: '16px',
                      fontWeight: '500'
                    }}>
                      점수: {item.score}/100
                    </span>
                  )}
                </div>

                <p style={{ color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                  {item.content}
                </p>

                <div className="flex items-center gap-4" style={{ fontSize: '14px', color: '#888' }}>
                  <div className="flex items-center gap-4">
                    <span>📧 수신자: {item.recipient}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>🕒 {formatDate(item.date)} {item.time}</span>
                  </div>
                  {item.template && (
                    <div style={{ color: '#1976d2' }}>
                      📝 템플릿: {item.template}
                    </div>
                  )}
                </div>
              </div>

              <button style={{
                padding: '8px',
                border: 'none',
                background: 'none',
                color: '#999',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '20px'
              }}>
                ⋮
              </button>
            </div>

            <div style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid #e0e0e0'
            }}>
              <div className="flex gap-4">
                <button className="btn btn-primary">
                  🔄 다시 사용
                </button>
                <button className="btn btn-secondary">
                  👀 상세 보기
                </button>
                {item.type === 'review' && (
                  <button className="btn btn-secondary">
                    🔍 다시 검토
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center" style={{ padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
          <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
            검색 결과가 없습니다
          </h3>
          <p style={{ color: '#666' }}>
            다른 검색어나 필터를 사용해보세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 