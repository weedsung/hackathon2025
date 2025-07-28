import api from './axios';

export const fetchReplyGuides = () => api.get('/reply-guide');