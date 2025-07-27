// backend/routes/user.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 인증 미들웨어
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: '인증 필요' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
}

// 내 설정 조회
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user.settings);
  } catch (err) {
    console.error('Settings fetch error:', err);
    res.status(500).json({ message: '설정 조회 중 오류가 발생했습니다.' });
  }
});

// 내 설정 저장/수정
router.put('/settings', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { settings: req.body },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user.settings);
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ message: '설정 저장 중 오류가 발생했습니다.' });
  }
});

// 내 프로필 정보 조회
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.json({
      name: user.name,
      email: user.email,
      department: user.department
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: '프로필 조회 중 오류가 발생했습니다.' });
  }
});

// 내 프로필 정보 업데이트
router.put('/me', auth, async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, department },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json({
      name: user.name,
      email: user.email,
      department: user.department
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
});

module.exports = {
  router,
  auth
};