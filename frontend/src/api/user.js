import api from './axios';

export const fetchUserSettings = (userId) => api.get('/user/settings', { params: { userId } });
export const saveUserSettings = (userId, settings) => api.put('/user/settings', { userId, ...settings });