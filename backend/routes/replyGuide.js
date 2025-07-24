const express = require('express');
const ReplyGuide = require('../models/ReplyGuide');
const router = express.Router();

// 전체 템플릿 목록
router.get('/', async (req, res) => {
  const guides = await ReplyGuide.find();
  res.json(guides);
});

// 단건 조회
router.get('/:id', async (req, res) => {
  const guide = await ReplyGuide.findById(req.params.id);
  if (!guide) return res.status(404).json({ message: 'Not found' });
  res.json(guide);
});

module.exports = router;