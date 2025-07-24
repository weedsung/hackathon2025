const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  const { email, password, name, department } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed, name, department });
  await user.save();
  res.status(201).json({ userId: user._id });
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.json({ token, userId: user._id });
});

// 내 설정 조회
router.get('/settings', async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json(user.settings);
});

// 내 설정 저장/수정
router.put('/settings', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { settings: req.body },
    { new: true }
  );
  res.json(user.settings);
});

module.exports = router;