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

module.exports = router;