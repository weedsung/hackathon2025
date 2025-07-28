import api from './axios';

// 대화 히스토리 조회 - auth 미들웨어로 사용자 정보 처리
export const fetchHistory = () => api.get('/history');

// 히스토리 저장
export const saveHistory = (historyData) => api.post('/history', historyData);

// 히스토리 삭제
export const deleteHistory = (id) => api.delete(`/history/${id}`);

// 히스토리 단건 조회
export const fetchHistoryItem = (id) => api.get(`/history/${id}`);