// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, department } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호는 필수입니다.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashed,
      name,
      department
    });
    await user.save();

    res.status(201).json({ message: '회원가입 성공', userId: user._id });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ message: '서버 오류로 회원가입 실패' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '이메일 또는 비밀번호 오류' });
    }

    res.json({
      message: '로그인 성공',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        department: user.department
      }
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).json({ message: '서버 오류로 로그인 실패' });
  }
});

module.exports = router;