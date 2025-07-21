import React, { useState } from 'react';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('guide');

  const faqs = [
    {
      id: 1,
      question: '메일 검토는 어떻게 작동하나요?',
      answer: 'AI가 입력한 이메일 내용을 분석하여 오해의 소지가 있는 표현, 감정적 톤, 문법 오류 등을 찾아내고 개선 방향을 제시합니다. GPT와 Gemini 모델을 활용하여 정확한 분석을 제공합니다.'
    },
    {
      id: 2,
      question: '답장 템플릿은 어떻게 사용하나요?',
      answer: '답장 메뉴얼 페이지에서 상황에 맞는 템플릿을 선택하고 복사 버튼을 클릭하여 클립보드에 저장할 수 있습니다. 필요에 따라 내용을 수정해서 사용하세요.'
    },
    {
      id: 3,
      question: '개인정보는 안전하게 보호되나요?',
      answer: '네, 모든 이메일 내용은 암호화되어 저장되며, 설정에서 데이터 보관 기간을 조정할 수 있습니다. 원하시면 언제든지 데이터를 삭제하거나 내보낼 수 있습니다.'
    },
    {
      id: 4,
      question: '하루에 몇 번까지 사용할 수 있나요?',
      answer: '현재 베타 버전에서는 일일 10회까지 무료로 사용 가능합니다. 향후 유료 플랜에서는 무제한 사용이 가능할 예정입니다.'
    },
    {
      id: 5,
      question: '분석 결과가 부정확한 경우 어떻게 하나요?',
      answer: 'AI 분석은 참고용이며, 최종 판단은 사용자가 하시기 바랍니다. 지속적으로 모델을 개선하고 있으며, 피드백을 주시면 더 나은 서비스로 발전할 수 있습니다.'
    },
    {
      id: 6,
      question: '모바일에서도 사용할 수 있나요?',
      answer: '네, 반응형 웹 디자인으로 제작되어 모바일, 태블릿에서도 최적화된 환경으로 사용하실 수 있습니다.'
    }
  ];

  const guides = [
    {
      id: 1,
      title: '메일 검토 기능 사용하기',
      steps: [
        '사이드바에서 "메일 검토" 메뉴를 클릭합니다.',
        '검토할 이메일 내용을 입력창에 붙여넣거나 직접 입력합니다.',
        '"검토 요청" 버튼을 클릭하여 AI 분석을 시작합니다.',
        '분석 결과에서 점수, 제안사항, 개선된 버전을 확인합니다.',
        '필요시 제안사항을 반영하여 이메일을 수정합니다.'
      ]
    },
    {
      id: 2,
      title: '답장 템플릿 활용하기',
      steps: [
        '"답장 메뉴얼" 페이지로 이동합니다.',
        '카테고리나 검색을 통해 적합한 템플릿을 찾습니다.',
        '"복사" 버튼을 클릭하여 템플릿을 클립보드에 복사합니다.',
        '이메일 작성 프로그램에 붙여넣고 상황에 맞게 수정합니다.',
        '"사용하기" 버튼으로 바로 메일 검토로 이동할 수도 있습니다.'
      ]
    },
    {
      id: 3,
      title: '히스토리 관리하기',
      steps: [
        '"대화 히스토리" 페이지에서 과거 기록을 확인합니다.',
        '검색창이나 필터를 사용하여 원하는 기록을 찾습니다.',
        '"다시 사용" 버튼으로 이전 이메일을 재활용할 수 있습니다.',
        '"다시 검토" 버튼으로 새로운 분석을 받을 수 있습니다.',
        '설정에서 히스토리 저장 기간을 조정할 수 있습니다.'
      ]
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">❓ 도움말</h1>
          <p className="page-description">
            이메일 AI 어시스턴트 사용법과 자주 묻는 질문을 확인하세요.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="card mb-4">
          <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
            {[
              { id: 'guide', label: '사용 가이드', icon: '📖' },
              { id: 'faq', label: '자주 묻는 질문', icon: '💬' },
              { id: 'video', label: '동영상 튜토리얼', icon: '🎥' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  color: activeTab === tab.id ? '#1976d2' : '#666',
                  borderBottom: activeTab === tab.id ? '2px solid #1976d2' : '2px solid transparent'
                }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 사용 가이드 탭 */}
          {activeTab === 'guide' && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {guides.map(guide => (
                  <div key={guide.id}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                      {guide.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {guide.steps.map((step, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '500',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </div>
                          <p style={{ color: '#333', lineHeight: '1.5' }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ 탭 */}
          {activeTab === 'faq' && (
            <div style={{ padding: '24px' }}>
              {/* 검색창 */}
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="질문을 검색하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>

              {/* FAQ 목록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredFaqs.map(faq => (
                  <div key={faq.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: 'none',
                        background: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <span style={{ fontWeight: '500', color: '#333' }}>{faq.question}</span>
                      <span style={{ fontSize: '20px', color: '#666' }}>
                        {expandedFaq === faq.id ? '🔼' : '🔽'}
                      </span>
                    </button>
                    {expandedFaq === faq.id && (
                      <div style={{ padding: '0 16px 16px 16px', backgroundColor: '#f8f9fa' }}>
                        <p style={{ color: '#555', lineHeight: '1.6' }}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center" style={{ padding: '32px' }}>
                  <p style={{ color: '#666' }}>검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* 동영상 튜토리얼 탭 */}
          {activeTab === 'video' && (
            <div style={{ padding: '24px' }}>
              <div className="text-center" style={{ padding: '48px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎥</div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                  동영상 튜토리얼 준비 중
                </h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                  더 나은 사용 경험을 위한 동영상 가이드를 제작 중입니다.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
                  <p style={{ fontSize: '14px', color: '#666' }}>📹 메일 검토 기능 사용법</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>📹 답장 템플릿 활용 가이드</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>📹 효과적인 이메일 작성 팁</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 연락처 정보 */}
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0d47a1', marginBottom: '12px' }}>
            추가 도움이 필요하신가요?
          </h3>
          <p style={{ color: '#1565c0', marginBottom: '16px' }}>
            문제가 해결되지 않거나 새로운 기능 제안이 있으시면 언제든 연락주세요.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary">
              💬 고객 지원 문의
            </button>
            <button style={{
              padding: '12px 24px',
              border: '1px solid #1976d2',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#1976d2',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}>
              💡 기능 제안하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 