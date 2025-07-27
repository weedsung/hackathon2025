const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, department } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호는 필수입니다.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name, department });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });
    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      department: user.department
    });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 입력값 검증
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호는 필수입니다.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    // 토큰 생성
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'devsecret', 
      { expiresIn: '1d' }
    );
    
    // 성공 응답
    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      department: user.department
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
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