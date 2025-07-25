import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { submitReview } from '../../api/review';

const ReviewPage = ({ userId }) => {
  const { settings } = useSettings();
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      alert('메일 내용을 입력해주세요.');
      return;
    }

    if (!userId) {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // API를 통한 검토 제출
      const data = await submitReview(emailContent, userId);
      setAnalysisResult(data.result);
    } catch (err) {
      console.error("검토 요청 실패:", err);
      setError('분석 실패');
      setAnalysisResult({
        overallScore: null,
        suggestions: [],
        toneFeedback: "❌ 분석 실패: 서버와의 연결에 문제가 있습니다.",
        improvedVersion: ""
      });
    } finally {
      setIsAnalyzing(false);
    }
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
          작성한 이메일을 AI가 분석하여 개선점을 제안해드립니다.
        </p>
      </div>

      <div className="review-container">
        <div className="input-section">
          <div className="input-header">
            <h3>📝 이메일 내용</h3>
            <div className="input-actions">
              <button 
                className="btn btn-secondary" 
                onClick={clearAll}
                disabled={isAnalyzing}
              >
                초기화
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !emailContent.trim()}
              >
                {isAnalyzing ? '분석 중...' : '분석하기'}
              </button>
            </div>
          </div>
          
          <textarea
            className="email-textarea"
            placeholder="검토할 이메일 내용을 입력하세요..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {analysisResult && (
          <div className="result-section">
            <div className="result-header">
              <h3>📊 분석 결과</h3>
              {analysisResult.overallScore && (
                <div className="score-badge">
                  점수: {analysisResult.overallScore}/100
                </div>
              )}
            </div>

            {analysisResult.toneFeedback && (
              <div className="feedback-card">
                <h4>톤 피드백</h4>
                <p>{analysisResult.toneFeedback}</p>
              </div>
            )}

            {analysisResult.improvedVersion && (
              <div className="improved-card">
                <h4>개선된 버전</h4>
                <div className="improved-content">
                  {analysisResult.improvedVersion}
                </div>
              </div>
            )}

            {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
              <div className="suggestions-card">
                <h4>개선 제안 ({analysisResult.suggestions.length}개)</h4>
                <div className="suggestions-list">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <div key={index} className={`suggestion-item ${suggestion.type}`}>
                      <div className="suggestion-header">
                        <span className={`suggestion-type ${suggestion.type}`}>
                          {suggestion.type === 'warning' ? '⚠️' : '💡'} {suggestion.type}
                        </span>
                      </div>
                      <p className="suggestion-text">{suggestion.text}</p>
                      {suggestion.suggestion && (
                        <div className="suggestion-improvement">
                          <strong>개선안:</strong> {suggestion.suggestion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage; 