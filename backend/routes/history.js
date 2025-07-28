const express = require('express');
const History = require('../models/History');
const { auth } = require('./user');
const router = express.Router();

// 전체 히스토리
router.get('/', auth, async (req, res) => {
  const history = await History.find({ user: req.user.userId }).sort({ date: -1 });
  res.json(history);
});

// 단건 조회
router.get('/:id', auth, async (req, res) => {
  const item = await History.findOne({ _id: req.params.id, user: req.user.userId });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// 새 히스토리 저장
router.post('/', auth, async (req, res) => {
  const { type, title, content, recipient, score, status, template } = req.body;
  const item = new History({
    user: req.user.userId, type, title, content, recipient, score, status, template
  });
  await item.save();
  res.status(201).json(item);
});

// 삭제
router.delete('/:id', auth, async (req, res) => {
  await History.deleteOne({ _id: req.params.id, user: req.user.userId });
  res.json({ message: 'Deleted' });
});

module.exports = router;