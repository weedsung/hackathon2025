// backend/routes/review.js
const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: 'userId와 content는 필수입니다.' });
    }

    // TODO: 실제 AI 분석 결과로 대체
    const dummyIssues = ['불명확한 표현 존재', '지나치게 딱딱한 어조'];
    const dummySuggestions = ['표현을 더 명확하게 수정', '좀 더 부드럽게 작성'];

    const review = new Review({
      userId,
      content,
      issues: dummyIssues,
      suggestions: dummySuggestions
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('리뷰 저장 실패:', error);
    res.status(500).json({ error: '서버 오류로 리뷰 저장에 실패했습니다.' });
  }
});

module.exports = router;
