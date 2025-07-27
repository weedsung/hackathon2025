import api from './axios';

// 내 프로필 정보 조회
export const fetchUserProfile = () => api.get('/user/me');

// 내 프로필 정보 업데이트
export const updateUserProfile = (profileData) => api.put('/user/me', profileData);

// 내 설정 조회
export const fetchUserSettings = () => api.get('/user/settings');

// 내 설정 저장/수정
export const saveUserSettings = (settings) => api.put('/user/settings', settings);