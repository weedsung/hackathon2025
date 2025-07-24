import api from '../api/axios';

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function register(email, password, name, department) {
  const res = await api.post('/auth/register', { email, password, name, department });
  return res.data;
}

export async function reviewEmail(emailContent, userId) {
  const res = await api.post('/review', { emailContent, userId });
  return res.data;
}

export async function getHistory(userId) {
  const res = await api.get('/history', { params: { userId } });
  return res.data;
}

export async function getReplyGuides() {
  const res = await api.get('/reply-guide');
  return res.data;
}

export async function getUserSettings(userId) {
  const res = await api.get('/user/settings', { params: { userId } });
  return res.data;
}

export async function updateUserSettings(userId, settings) {
  const res = await api.put('/user/settings', { userId, ...settings });
  return res.data;
}
