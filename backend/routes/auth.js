const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, department } = req.body;
    
    // 입력값 검증
    if (!email || !password || !name) {
      return res.status(400).json({ message: '이메일, 비밀번호, 이름은 필수입니다.' });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '올바른 이메일 형식을 입력해주세요.' });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // 기존 사용자 확인
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 해시화
    const hashed = await bcrypt.hash(password, 10);
    
    // 사용자 생성
    const user = new User({ 
      email, 
      password: hashed, 
      name, 
      department: department || '미지정'
    });
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'devsecret', 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      message: '회원가입이 완료되었습니다.'
    });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 입력값 검증
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 테스트 계정 (DB 없이도 사용 가능)
    if (email === 'test@example.com' && password === 'test123') {
      const token = jwt.sign(
        { userId: 'test-user-id' }, 
        process.env.JWT_SECRET || 'devsecret', 
        { expiresIn: '24h' }
      );
      return res.json({
        token,
        userId: 'test-user-id',
        name: '테스트 사용자',
        email: 'test@example.com',
        department: '개발팀',
        message: '테스트 계정으로 로그인되었습니다.'
      });
    }
    
    // DB에서 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 검증
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'devsecret', 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      message: '로그인되었습니다.'
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    // DB 연결 실패 시에도 테스트 계정은 사용 가능
    return res.status(500).json({ 
      message: '서버 오류가 발생했습니다. 테스트 계정을 사용해보세요: test@example.com / test123',
      error: err.message 
    });
  }
});

// 토큰 검증
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    
    // 테스트 계정인 경우
    if (decoded.userId === 'test-user-id') {
      return res.json({
        valid: true,
        userId: 'test-user-id',
        name: '테스트 사용자',
        email: 'test@example.com',
        department: '개발팀'
      });
    }

    // DB에서 사용자 정보 조회
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
    }

    res.json({
      valid: true,
      userId: user._id,
      name: user.name,
      email: user.email,
      department: user.department
    });
  } catch (err) {
    console.error('토큰 검증 오류:', err);
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
});

module.exports = router;