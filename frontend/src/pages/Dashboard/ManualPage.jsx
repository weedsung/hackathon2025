import React, { useState } from 'react';

const ManualPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const categories = [
    { id: 'all', name: '전체', count: 24 },
    { id: 'apology', name: '사과', count: 5 },
    { id: 'request', name: '요청', count: 8 },
    { id: 'response', name: '답변', count: 6 },
    { id: 'meeting', name: '회의', count: 5 }
  ];

  const templates = [
    {
      id: 1,
      category: 'apology',
      title: '늦은 응답 사과',
      situation: '이메일 답장이 늦었을 때',
      content: '안녕하세요.\n\n늦은 답변으로 인해 불편을 드려 죄송합니다.\n[구체적인 사유]로 인해 답변이 지연되었습니다.\n\n향후 이런 일이 발생하지 않도록 더욱 주의하겠습니다.\n\n감사합니다.'
    },
    {
      id: 2,
      category: 'request',
      title: '정중한 자료 요청',
      situation: '동료나 거래처에 자료를 요청할 때',
      content: '안녕하세요.\n\n[프로젝트명] 관련하여 연락드립니다.\n\n[구체적인 자료명]에 대한 자료를 요청드리고 싶습니다.\n가능하시면 [날짜]까지 공유해 주시면 감사하겠습니다.\n\n바쁘신 중에도 협조해 주셔서 감사합니다.'
    },
    {
      id: 3,
      category: 'response',
      title: '긍정적 피드백 응답',
      situation: '칭찬이나 긍정적 피드백을 받았을 때',
      content: '안녕하세요.\n\n소중한 피드백을 주셔서 진심으로 감사합니다.\n\n앞으로도 더 나은 결과를 위해 최선을 다하겠습니다.\n계속해서 좋은 협력 관계를 유지할 수 있기를 바랍니다.\n\n감사합니다.'
    },
    {
      id: 4,
      category: 'meeting',
      title: '회의 일정 조율',
      situation: '회의 일정을 조율해야 할 때',
      content: '안녕하세요.\n\n[회의 주제] 관련 회의 일정을 조율하고자 합니다.\n\n제안 가능한 시간:\n- [날짜 시간]\n- [날짜 시간]\n- [날짜 시간]\n\n참석하시기 편한 시간을 알려주시면 감사하겠습니다.\n\n감사합니다.'
    },
    {
      id: 5,
      category: 'request',
      title: '업무 협조 요청',
      situation: '동료에게 업무 도움을 요청할 때',
      content: '안녕하세요.\n\n[업무명] 진행 중 도움이 필요하여 연락드립니다.\n\n[구체적인 도움 내용]에 대해 조언을 구하고 싶습니다.\n시간이 되실 때 잠깐 이야기할 수 있을까요?\n\n바쁘신 중에 번거롭게 해드려 죄송합니다.\n감사합니다.'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.situation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📝 답장 메뉴얼</h1>
        <p className="page-description">
          상황별 이메일 템플릿으로 더 효과적인 커뮤니케이션을 시작하세요.
        </p>
      </div>

      <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
        {/* 사이드바 필터 */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          {/* 검색 */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="템플릿 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '20px' }}>🏷️</span>
              <h3 className="card-title">카테고리</h3>
            </div>
            <div>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`nav-item ${selectedCategory === category.id ? 'active' : ''}`}
                  style={{ marginBottom: '8px' }}
                >
                  <span>{category.name}</span>
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    marginLeft: 'auto'
                  }}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 템플릿 목록 */}
        <div style={{ flex: 1 }}>
          {filteredTemplates.map((template, index) => (
            <div key={template.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {template.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {template.situation}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  fontSize: '12px',
                  borderRadius: '16px',
                  fontWeight: '500'
                }}>
                  {categories.find(cat => cat.id === template.category)?.name}
                </span>
              </div>

              <div style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {template.content}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleCopy(template.content, index)}
                  className="btn btn-secondary"
                >
                  {copiedIndex === index ? '✅ 복사됨!' : '📋 복사'}
                </button>
                
                <button className="btn btn-primary">
                  🚀 사용하기
                </button>
              </div>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ color: '#666' }}>
                검색 결과가 없습니다. 다른 키워드로 검색해보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualPage; 