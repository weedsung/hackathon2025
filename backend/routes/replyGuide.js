// backend/routes/replyGuide.js
const express = require('express');
const router = express.Router();
const ReplyGuide = require('../models/ReplyGuide');

router.get('/', async (req, res) => {
  try {
    const { keyword, category } = req.query;

    let filter = {};
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (category && category !== '전체') {
      filter.category = category;
    }

    const guides = await ReplyGuide.find(filter).sort({ createdAt: -1 });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: '템플릿 불러오기 실패' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const guide = new ReplyGuide({ title, content, category });
    await guide.save();
    res.status(201).json(guide);
  } catch (err) {
    res.status(500).json({ error: '템플릿 저장 실패' });
  }
});

module.exports = router;