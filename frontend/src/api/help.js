import api from './axios';

export const fetchHelpItems = async () => {
  const res = await api.get('/help/faq');
  return res.data; // 실제 FAQ 배열만 반환
};