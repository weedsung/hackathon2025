import api from './axios';

// 이메일 검토 요청
export const reviewEmail = (emailText, tone, analysisLevel, autoCorrection) => 
  api.post('/review', { emailText, tone, analysisLevel, autoCorrection });

// 검토 히스토리 조회
export const getReviewHistory = () => 
  api.get('/review/history');

// 특정 검토 결과 조회
export const getReviewById = (id) => 
  api.get(`/review/${id}`);