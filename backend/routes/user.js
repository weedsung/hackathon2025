// backend/routes/user.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 인증 미들웨어
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: '인증 필요' });
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: '토큰 형식이 올바르지 않습니다.' });
  }
  
  const token = parts[1];
  
  // 토큰 형식 검증 (JWT는 3개의 부분으로 구성)
  if (!token.includes('.') || token.split('.').length !== 3) {
    return res.status(401).json({ message: '유효하지 않은 토큰 형식입니다.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('토큰 검증 오류:', err.message);
    res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
}

// 내 설정 조회
router.get('/settings', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json(user.settings);
});

// 내 설정 저장/수정
router.put('/settings', auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { settings: req.body },
    { new: true }
  );
  res.json(user.settings);
});

// 내 프로필 정보 조회
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  res.json({
    name: user.name,
    email: user.email,
    department: user.department
  });
});

module.exports = {
  router,
  auth
};