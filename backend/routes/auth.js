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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
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
  
  // 테스트 계정 (DB 없이도 사용 가능)
  if (email === 'test@example.com' && password === 'test123') {
    const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return res.json({
      token,
      userId: 'test-user-id',
      name: '테스트 사용자',
      email: 'test@example.com',
      department: '개발팀'
    });
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      department: user.department
    });
  } catch (err) {
    // DB 연결 실패 시에도 테스트 계정은 사용 가능
    return res.status(500).json({ message: '서버 오류. 테스트 계정을 사용해보세요: test@example.com / test123' });
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