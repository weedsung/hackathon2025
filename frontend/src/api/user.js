import api from './axios';

// 사용자 설정 조회 - auth 미들웨어로 사용자 정보 처리
export const fetchUserSettings = () => api.get('/user/settings');

// 사용자 설정 저장 - auth 미들웨어로 사용자 정보 처리
export const saveUserSettings = (settings) => api.put('/user/settings', settings);

// 사용자 프로필 정보 조회
export const fetchUserProfile = () => api.get('/user/me');