// backend/routes/help.js
const express = require('express');
const router = express.Router();
const Help = require('../models/Help');

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const result = await Help.find(filter).sort({ createdAt: 1 });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: '도움말 불러오기 실패' });
  }
});

//관리자용 등록 API
router.post('/', async (req, res) => {
  try {
    const { type, title, content } = req.body;
    const item = new Help({ type, title, content });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: '도움말 등록 실패' });
  }
});

module.exports = router;