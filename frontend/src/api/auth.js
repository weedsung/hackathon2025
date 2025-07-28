import api from '../api/axios';

// JWT 토큰 유효성 검증 함수
function isValidJWT(token) {
  try {
    // 1. 기본 형식 검증
    if (!token || typeof token !== 'string') return false;
    if (!token.includes('.') || token.split('.').length !== 3) return false;
    
    // 2. Base64 디코딩 테스트
    const parts = token.split('.');
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    // 3. JWT 헤더 검증
    if (header.typ !== 'JWT') return false;
    
    // 4. 만료 시간 검증
    if (payload.exp && payload.exp < Date.now() / 1000) {
      console.log('토큰이 만료되었습니다.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('JWT 검증 실패:', error);
    return false;
  }
}

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function register(email, password, name, department) {
  const res = await api.post('/auth/register', { email, password, name, department });
  return res.data;
}

export async function verifyToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('토큰이 없습니다.');
  }
  
  // 게스트 토큰인 경우 - JWT 검증 건너뛰기
  if (token === 'guest-token-123') {
    return {
      valid: true,
      userId: 'guest-user',
      name: '게스트 사용자',
      email: 'guest@example.com',
      department: '게스트'
    };
  }
  
  // JWT 토큰 유효성 검증 (게스트 토큰이 아닌 경우만)
  if (!isValidJWT(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDepartment');
    throw new Error('유효하지 않은 토큰입니다.');
  }
  
  try {
    const res = await api.get('/auth/verify');
    return res.data;
  } catch (error) {
    // 토큰이 유효하지 않으면 로컬 스토리지에서 제거
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userDepartment');
    }
    throw error;
  }
}

export async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userDepartment');
}
