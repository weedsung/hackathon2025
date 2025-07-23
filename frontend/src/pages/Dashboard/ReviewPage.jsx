import React, { useState } from 'react';

const ReviewPage = () => {
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

const handleAnalyze = async () => {
  if (!emailContent.trim()) {
    alert('메일 내용을 입력해주세요.');
    return;
  }

  setIsAnalyzing(true);

  try {
    const res = await fetch("http://localhost:5000/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailText: emailContent,
        tone: "중립적" // 나중에 UI로 선택하게 바꿔도 됨
      })
    });

    const data = await res.json();

    setAnalysisResult({
      overallScore: data.overallScore,
      suggestions: data.suggestions,
      toneFeedback: data.toneFeedback,
      improvedVersion: data.improvedVersion
    });
  } catch (err) {
    console.error("검토 요청 실패:", err);
    setAnalysisResult({
      overallScore: null,
      suggestions: [],
      toneFeedback: "❌ 분석 실패: 서버와의 연결에 문제가 있습니다.",
      improvedVersion: ""
    });
  }

  setIsAnalyzing(false);
};

  const clearAll = () => {
    setEmailContent('');
    setAnalysisResult(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📨 메일 검토</h1>
        <p className="page-description">
          작성한 이메일의 오해 소지를 AI가 분석하고 개선 방향을 제안합니다.
        </p>
      </div>

      <div className="grid grid-2">
        {/* 입력 영역 */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '20px' }}>✍️</span>
            <h2 className="card-title">이메일 내용 입력</h2>
          </div>
          
          <div className="form-group">
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="검토할 이메일 내용을 붙여넣거나 입력해주세요..."
              className="form-textarea"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#666' }}>
              {emailContent.length} 글자
            </span>
            
            <div className="flex gap-4">
              <button
                onClick={clearAll}
                className="btn btn-secondary"
              >
                지우기
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn btn-primary"
              >
                {isAnalyzing ? (
                  <>
                    <div className="loading-spinner"></div>
                    분석 중...
                  </>
                ) : (
                  <>
                    🚀 검토 요청
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 분석 결과 영역 */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '20px' }}>📊</span>
            <h2 className="card-title">분석 결과</h2>
          </div>
          
          {!analysisResult ? (
            <div className="text-center" style={{ padding: '60px 20px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <p>메일 내용을 입력하고 검토를 요청해보세요.</p>
            </div>
          ) : (
            <div>
              {/* 점수 표시 */}
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px', 
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div className="flex justify-between items-center mb-4">
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>전체 점수</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                    {analysisResult.overallScore}/100
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px', 
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      backgroundColor: '#1976d2', 
                      height: '8px', 
                      borderRadius: '4px',
                      width: `${analysisResult.overallScore}%`,
                      transition: 'width 1s ease'
                    }}
                  ></div>
                </div>
              </div>

              {/* 제안사항 */}
              <div style={{ marginBottom: '20px' }}>
                {analysisResult.suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${suggestion.type === 'warning' ? '#ff9800' : '#2196f3'}`,
                      backgroundColor: suggestion.type === 'warning' ? '#fff3e0' : '#e3f2fd',
                      marginBottom: '12px'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <span style={{ fontSize: '20px' }}>
                        {suggestion.type === 'warning' ? '⚠️' : '💡'}
                      </span>
                      <div>
                        <p style={{ fontSize: '14px', marginBottom: '4px' }}>{suggestion.text}</p>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                          {suggestion.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 개선된 버전 */}
              {analysisResult.improvedVersion && (
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    개선된 버전
                  </h3>
                  <div style={{
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{analysisResult.improvedVersion}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage; 