import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useLocation } from 'react-router-dom';

const ReviewPage = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  // ComposePage에서 전달받은 이메일 데이터 처리
  useEffect(() => {
    if (location.state && location.state.emailData) {
      const { emailData } = location.state;
      setEmailContent(emailData.content || '');
      
      // 자동으로 분석 시작
      if (emailData.content && emailData.content.trim()) {
        setTimeout(() => {
          handleAnalyze();
        }, 500);
      }
    }
  }, [location.state]);

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      alert('메일 내용을 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch("http://localhost:5000/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          emailText: emailContent,
          tone: settings?.defaultTone || 'polite',
          analysisLevel: settings?.analysisLevel || 'detailed',
          autoCorrection: settings?.autoCorrection || true
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        }
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('API 응답:', data);

      // 응답 데이터 안전하게 처리
      setAnalysisResult({
        overallScore: data.overallScore || 75,
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [
          {
            type: "info",
            text: "AI 분석이 현재 비활성화되어 있습니다.",
            suggestion: "테스트 모드에서 실행 중입니다."
          }
        ],
        toneFeedback: data.toneFeedback || "AI 분석 기능이 현재 데모 모드로 실행 중입니다.",
        improvedVersion: data.improvedVersion || "데모 모드에서는 개선된 버전을 제공하지 않습니다."
      });

    } catch (err) {
      console.error("검토 요청 실패:", err);
      setError(err.message || '분석 중 오류가 발생했습니다.');
      
      // 오류 시에도 안전한 기본값 설정
      setAnalysisResult({
        overallScore: 0,
        suggestions: [
          {
            type: "warning",
            text: "서버 연결 실패",
            suggestion: "네트워크 연결을 확인하고 다시 시도해주세요."
          }
        ],
        toneFeedback: `❌ 분석 실패: ${err.message}`,
        improvedVersion: ""
      });
    }

    setIsAnalyzing(false);
  };

  const clearAll = () => {
    setEmailContent('');
    setAnalysisResult(null);
    setError('');
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
              style={{ minHeight: '200px' }}
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#f44336', 
              backgroundColor: '#ffebee',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '14px', color: '#666' }}>
              {emailContent.length} 글자
            </span>
            
            <div className="flex gap-4">
              <button 
                onClick={clearAll}
                className="btn btn-secondary"
                disabled={isAnalyzing}
              >
                지우기
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !emailContent.trim()}
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
                      width: `${Math.max(0, Math.min(100, analysisResult.overallScore || 0))}%`,
                      transition: 'width 1s ease'
                    }}
                  ></div>
                </div>
              </div>

              {/* 톤 피드백 */}
              {analysisResult.toneFeedback && (
                <div style={{ 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '8px', 
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    📝 톤 피드백
                  </h3>
                  <p style={{ fontSize: '14px', margin: 0 }}>{analysisResult.toneFeedback}</p>
                </div>
              )}

              {/* 제안사항 */}
              {analysisResult.suggestions && Array.isArray(analysisResult.suggestions) && analysisResult.suggestions.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                    💡 개선 제안 ({analysisResult.suggestions.length}개)
                  </h3>
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
                        <p style={{ fontSize: '14px', marginBottom: '4px' }}>{suggestion.text || '제안 내용'}</p>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                          {suggestion.suggestion || '개선 방향'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}

              {/* 개선된 버전 */}
              {analysisResult.improvedVersion && (
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    ✨ 개선된 버전
                  </h3>
                  <div style={{
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{analysisResult.improvedVersion}</p>
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