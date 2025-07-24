import api from './axios';

export const submitReview = (emailContent, userId) => api.post('/review', { emailContent, userId });