import api from './axios';

// 대화 히스토리 조회
export const fetchHistory = () => api.get('/history');