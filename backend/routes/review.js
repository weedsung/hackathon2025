const express = require('express');
const Review = require('../models/Review');
const { auth } = require('./user');
const router = express.Router();

// 메일 검토 요청 (AI 연동은 별도 함수로)
router.post('/', auth, async (req, res) => {
  const { emailContent } = req.body;
  // 1. AI API 호출(생략)
  // 2. 결과 예시
  const result = {
    overallScore: 85,
    emotionScore: 'neutral',
    misunderstandingRisk: 'low',
    suggestions: [],
    improvedVersion: emailContent // 실제론 AI 결과
  };
  const review = new Review({ user: req.user.userId, emailContent, result });
  await review.save();
  res.status(201).json(review);
});

// 내 분석 히스토리
router.get('/history', auth, async (req, res) => {
  const reviews = await Review.find({ user: req.user.userId }).sort({ createdAt: -1 });
  res.json(reviews);
});

// 단건 조회
router.get('/:id', auth, async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user.userId });
  if (!review) return res.status(404).json({ message: 'Not found' });
  res.json(review);
});

module.exports = router;