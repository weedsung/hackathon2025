import api from './axios';

// 답장 가이드 전체 조회 - 인증 불필요, 공통 데이터
export const fetchReplyGuides = () => api.get('/reply-guide');

// 답장 가이드 단건 조회
export const fetchReplyGuide = (id) => api.get(`/reply-guide/${id}`);