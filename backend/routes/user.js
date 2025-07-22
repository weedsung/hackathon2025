// backend/routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 사용자 설정 가져오기
router.get('/:id/settings', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    name: user.name,
    email: user.email,
    department: user.department,
    tone: user.tone,
    notification: user.notification,
    aiSettings: user.aiSettings,
    dataSettings: user.dataSettings
  });
});

// 사용자 설정 저장
router.post('/:id/settings', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        tone: req.body.tone,
        notification: req.body.notification,
        aiSettings: req.body.aiSettings,
        dataSettings: req.body.dataSettings
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '설정 저장 실패' });
  }
});