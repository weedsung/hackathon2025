import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ComposePage = () => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.mail) {
      setEmailData({
        to: location.state.mail.recipient || location.state.mail.to || '',
        subject: location.state.mail.title || location.state.mail.subject || '',
        content: location.state.mail.content || ''
      });
      setIsComposing(true);
      setSelectedEmail(null);
    } else if (location.state && location.state.template) {
      setEmailData({
        to: '',
        subject: location.state.template.title || '',
        content: location.state.template.content || ''
      });
      setIsComposing(true);
      setSelectedEmail(null);
    }
    // eslint-disable-next-line
  }, [location.state]);

  // 샘플 메일 데이터
  const sampleEmails = {
    inbox: [
      {
        id: 1,
        from: 'manager@company.com',
        fromName: '김팀장',
        subject: '프로젝트 진행 상황 보고 요청',
        preview: '안녕하세요. 현재 진행 중인 프로젝트의 상황을 보고해 주세요...',
        content: `안녕하세요. 김팀장입니다.

현재 진행 중인 프로젝트의 상황을 보고해 주세요.

특히 다음 항목들에 대해 상세히 알려주시면 감사하겠습니다:
• 현재 진행률
• 예상 완료일
• 발생한 이슈나 지연 사항

회신 부탁드립니다.

감사합니다.`,
        time: '오전 10:30',
        isRead: false,
        isImportant: true
      },
      {
        id: 2,
        from: 'hr@company.com',
        fromName: 'HR팀',
        subject: '월말 회식 일정 안내',
        preview: '다음 주 금요일 월말 회식을 진행하려고 합니다...',
        content: `안녕하세요. HR팀입니다.

다음 주 금요일 월말 회식을 진행하려고 합니다.

• 일시: 2025년 1월 31일 (금) 오후 7시
• 장소: 강남역 근처 (추후 공지)
• 참석 여부: 1월 27일까지 회신

참석 가능 여부를 알려주세요.

감사합니다.`,
        time: '어제',
        isRead: true,
        isImportant: false
      },
      {
        id: 3,
        from: 'client@external.com',
        fromName: '박과장 (ABC회사)',
        subject: '미팅 일정 변경 요청',
        preview: '예정되어 있던 미팅 일정을 변경하고 싶습니다...',
        content: `안녕하세요. ABC회사 박과장입니다.

예정되어 있던 미팅 일정을 변경하고 싶습니다.

갑작스런 요청 죄송합니다만, 다른 급한 일정이 생겨서
미팅을 다음 주로 연기할 수 있을까요?

가능한 시간대를 알려주시면 조율하겠습니다.

감사합니다.`,
        time: '1월 20일',
        isRead: true,
        isImportant: false
      }
    ],
    sent: [
      {
        id: 4,
        to: 'team@company.com',
        toName: '팀원들',
        subject: '주간 업무 보고',
        preview: '이번 주 업무 진행 상황을 공유드립니다...',
        content: `안녕하세요. 

이번 주 업무 진행 상황을 공유드립니다.

완료된 업무:
• 프로젝트 기획서 1차 완료
• 클라이언트 미팅 진행
• 개발 환경 구축

다음 주 계획:
• 프로젝트 기획서 검토 및 수정
• 개발 시작

감사합니다.`,
        time: '금요일',
        isRead: true,
        isImportant: false
      }
    ],
    drafts: [
      {
        id: 5,
        to: 'director@company.com',
        toName: '이사님',
        subject: '예산 승인 요청',
        preview: '프로젝트 진행을 위한 추가 예산 승인을 요청드립니다...',
        content: `안녕하세요. 이사님.

프로젝트 진행을 위한 추가 예산 승인을 요청드립니다.

필요 항목:
• 개발 도구 라이선스: 500만원
• 외부 업체 용역비: 1,000만원
• 기타 운영비: 200만원

총 1,700만원의 추가 예산이 필요합니다.

검토 후 승인 부탁드립니다.

감사합니다.`,
        time: '임시저장',
        isRead: false,
        isImportant: false
      }
    ]
  };

  // 탭별 전체 개수 계산
  const inboxCount = sampleEmails.inbox.length;
  const sentCount = sampleEmails.sent.length;
  const draftsCount = sampleEmails.drafts.length;

  const emailTemplates = [
    {
      id: 'meeting',
      name: '회의 일정 조율',
      subject: '회의 일정 조율 문의',
      content: `안녕하세요.

회의 일정을 조율하고자 연락드립니다.

다음 주 중 가능한 시간대를 알려주시면
조율하여 회의 일정을 확정하겠습니다.

• 가능한 날짜: 
• 선호 시간: 

감사합니다.`
    },
    {
      id: 'follow_up',
      name: '업무 진행 확인',
      subject: '업무 진행 상황 확인',
      content: `안녕하세요.

지난번 말씀드린 건에 대해
진행 상황을 확인하고자 연락드립니다.

혹시 추가로 필요한 사항이나
문의사항이 있으시면 언제든 연락주세요.

감사합니다.`
    },
    {
      id: 'request',
      name: '요청사항',
      subject: '업무 요청',
      content: `안녕하세요.

다음과 같은 내용으로 요청드립니다:

• 요청 내용: 
• 완료 희망일: 
• 우선순위: 

검토 후 회신 부탁드립니다.

감사합니다.`
    }
  ];

  const handleInputChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setEmailData({
      to: emailData.to,
      subject: template.subject,
      content: template.content
    });
  };

  const generateSuggestions = async () => {
    if (!emailData.content.trim()) {
      alert('메일 내용을 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      setSuggestions([
        {
          type: 'tone',
          title: '톤 개선',
          suggestion: '더 정중한 표현으로 수정하면 좋겠습니다.',
          before: '확인해주세요',
          after: '확인 부탁드립니다'
        },
        {
          type: 'structure',
          title: '구조 개선',
          suggestion: '인사말을 추가하면 더 자연스러워집니다.',
          before: '바로 본론으로 시작',
          after: '"안녕하세요"로 시작하기'
        },
        {
          type: 'clarity',
          title: '명확성 향상',
          suggestion: '구체적인 일정을 제시하면 좋겠습니다.',
          before: '빨리',
          after: '이번 주 금요일까지'
        }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const applySuggestion = (suggestion) => {
    if (suggestion.before && suggestion.after) {
      const updatedContent = emailData.content.replace(
        suggestion.before,
        suggestion.after
      );
      setEmailData(prev => ({
        ...prev,
        content: updatedContent
      }));
    }
  };

  const sendToReview = () => {
    if (!emailData.content.trim()) {
      alert('메일 내용을 입력해주세요.');
      return;
    }
    
    alert('검토 페이지로 이동하는 기능은 추후 구현됩니다.');
  };

  const clearAll = () => {
    setEmailData({
      to: '',
      subject: '',
      content: ''
    });
    setSuggestions([]);
    setSelectedTemplate('');
  };

  const startComposing = () => {
    setIsComposing(true);
    setSelectedEmail(null);
    clearAll();
  };

  const selectEmail = (email) => {
    setSelectedEmail(email);
    setIsComposing(false);
    setSuggestions([]);
  };

  const replyToEmail = (email) => {
    setIsComposing(true);
    setEmailData({
      to: email.from || email.to,
      subject: `Re: ${email.subject}`,
      content: `\n\n--- 원본 메시지 ---\n보낸 사람: ${email.fromName || email.toName}\n제목: ${email.subject}\n\n${email.content}`
    });
    setSelectedEmail(null);
  };

  const getCurrentEmails = () => {
    return sampleEmails[activeTab] || [];
  };

  const getTabLabel = (tab) => {
    const labels = {
      inbox: '받은편지함',
      sent: '보낸편지함', 
      drafts: '임시보관함'
    };
    return labels[tab];
  };

  const formatTime = (time) => {
    return time;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📧 이메일</h1>
        <p className="page-description">
          {isComposing ? 'AI의 도움을 받아 효과적인 이메일을 작성하세요.' : '이메일을 확인하고 관리하세요.'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }}>
        {/* 메일 목록 사이드바 */}
        <div style={{ width: '350px', display: 'flex', flexDirection: 'column' }}>
          {/* 새 메일 작성 버튼 */}
          <button
            onClick={startComposing}
            className="btn btn-primary"
            style={{ marginBottom: '20px', width: '100%' }}
          >
            ✍️ 새 메일 작성
          </button>

          {/* 탭 메뉴 */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e0e0e0',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => setActiveTab('inbox')}
              style={{
                flex: 1,
                padding: '12px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'inbox' ? '2px solid #1976d2' : '2px solid transparent',
                color: activeTab === 'inbox' ? '#1976d2' : '#666',
                fontWeight: activeTab === 'inbox' ? '500' : 'normal',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              받은편지함 ({inboxCount})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              style={{
                flex: 1,
                padding: '12px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'sent' ? '2px solid #1976d2' : '2px solid transparent',
                color: activeTab === 'sent' ? '#1976d2' : '#666',
                fontWeight: activeTab === 'sent' ? '500' : 'normal',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              보낸편지함 ({sentCount})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              style={{
                flex: 1,
                padding: '12px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'drafts' ? '2px solid #1976d2' : '2px solid transparent',
                color: activeTab === 'drafts' ? '#1976d2' : '#666',
                fontWeight: activeTab === 'drafts' ? '500' : 'normal',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              임시보관함 ({draftsCount})
            </button>
          </div>

          {/* 메일 목록 */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }}>
            {getCurrentEmails().map((email) => (
              <div
                key={email.id}
                onClick={() => selectEmail(email)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  backgroundColor: selectedEmail?.id === email.id ? '#f5f5f5' : 'white',
                  borderLeft: !email.isRead && activeTab === 'inbox' ? '4px solid #1976d2' : '4px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (selectedEmail?.id !== email.id) {
                    e.target.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedEmail?.id !== email.id) {
                    e.target.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    fontWeight: !email.isRead && activeTab === 'inbox' ? 'bold' : 'normal',
                    fontSize: '14px',
                    color: '#333'
                  }}>
                    {email.fromName || email.toName}
                    {email.isImportant && <span style={{ color: '#ff9800', marginLeft: '4px' }}>⭐</span>}
                  </div>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {formatTime(email.time)}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: !email.isRead && activeTab === 'inbox' ? '500' : 'normal',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {email.subject}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {email.preview}
                </div>
              </div>
            ))}
            
            {getCurrentEmails().length === 0 && (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: '#666'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                <p>메일이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 메일 내용/작성 영역 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {isComposing ? (
            // 메일 작성 영역
            <div className="grid grid-2" style={{ height: '100%' }}>
              {/* 작성 영역 */}
              <div className="card">
                <div className="card-header">
                  <span style={{ fontSize: '20px' }}>📝</span>
                  <h2 className="card-title">이메일 작성</h2>
                </div>
                
                {/* 템플릿 선택 */}
                <div className="form-group">
                  <label className="form-label">템플릿 선택 (선택사항)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {emailTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`btn btn-outline ${selectedTemplate === template.id ? 'btn-primary' : ''}`}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 받는 사람 */}
                <div className="form-group">
                  <label className="form-label">받는 사람</label>
                  <input
                    type="email"
                    value={emailData.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                    placeholder="example@company.com"
                    className="form-input"
                  />
                </div>

                {/* 제목 */}
                <div className="form-group">
                  <label className="form-label">제목</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="이메일 제목을 입력하세요"
                    className="form-input"
                  />
                </div>

                {/* 내용 */}
                <div className="form-group">
                  <label className="form-label">내용</label>
                  <textarea
                    value={emailData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="이메일 내용을 입력하세요..."
                    className="form-textarea"
                    style={{ minHeight: '200px' }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {emailData.content.length} 글자
                  </span>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={clearAll}
                      className="btn btn-secondary"
                    >
                      지우기
                    </button>
                    <button
                      onClick={generateSuggestions}
                      disabled={isGenerating}
                      className="btn btn-outline"
                    >
                      {isGenerating ? (
                        <>
                          <div className="loading-spinner"></div>
                          분석 중...
                        </>
                      ) : (
                        <>
                          🤖 AI 추천받기
                        </>
                      )}
                    </button>
                    <button
                      onClick={sendToReview}
                      className="btn btn-primary"
                    >
                      📨 검토하기
                    </button>
                  </div>
                </div>
              </div>

              {/* AI 추천 영역 */}
              <div className="card">
                <div className="card-header">
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  <h2 className="card-title">AI 추천</h2>
                </div>
                
                {suggestions.length === 0 ? (
                  <div className="text-center" style={{ padding: '60px 20px', color: '#666' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
                    <p>메일 내용을 입력하고 AI 추천을 받아보세요.</p>
                  </div>
                ) : (
                  <div>
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        style={{
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          marginBottom: '12px',
                          backgroundColor: '#fafafa'
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                              {suggestion.title}
                            </h4>
                            <p style={{ fontSize: '13px', color: '#666' }}>
                              {suggestion.suggestion}
                            </p>
                          </div>
                          <button
                            onClick={() => applySuggestion(suggestion)}
                            className="btn btn-outline"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                          >
                            적용
                          </button>
                        </div>
                        
                        {suggestion.before && suggestion.after && (
                          <div style={{ fontSize: '12px' }}>
                            <div style={{ color: '#d32f2f', marginBottom: '2px' }}>
                              <span style={{ fontWeight: '500' }}>수정 전:</span> {suggestion.before}
                            </div>
                            <div style={{ color: '#2e7d32' }}>
                              <span style={{ fontWeight: '500' }}>수정 후:</span> {suggestion.after}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : selectedEmail ? (
            // 메일 읽기 영역
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ borderBottom: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                      {selectedEmail.subject}
                    </h2>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      <strong>보낸 사람:</strong> {selectedEmail.fromName || selectedEmail.toName} 
                      &lt;{selectedEmail.from || selectedEmail.to}&gt;
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {selectedEmail.time}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {activeTab === 'inbox' && (
                      <button
                        onClick={() => replyToEmail(selectedEmail)}
                        className="btn btn-outline"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        ↩️ 답장
                      </button>
                    )}
                    {activeTab === 'drafts' && (
                      <button
                        onClick={() => {
                          setEmailData({
                            to: selectedEmail.to,
                            subject: selectedEmail.subject,
                            content: selectedEmail.content
                          });
                          setIsComposing(true);
                          setSelectedEmail(null);
                        }}
                        className="btn btn-outline"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        ✏️ 편집
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                flex: 1, 
                padding: '24px', 
                overflowY: 'auto',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {selectedEmail.content}
                </div>
              </div>
            </div>
          ) : (
            // 초기 화면 (메일 선택 안됨)
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📧</div>
                <h3 style={{ marginBottom: '8px' }}>메일을 선택하세요</h3>
                <p>왼쪽 목록에서 읽을 메일을 선택하거나 새 메일을 작성해보세요.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComposePage; 