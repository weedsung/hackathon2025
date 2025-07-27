const express = require('express');
const Review = require('../models/Review');
const { auth } = require('./user');
const router = express.Router();

// 메일 검토 요청 (AI 연동은 별도 함수로)
router.post('/', auth, async (req, res) => {
  try {
    const { emailText, tone, analysisLevel, autoCorrection } = req.body;
    
    if (!emailText) {
      return res.status(400).json({ message: 'emailText is required' });
    }

    // 1. AI API 호출(생략)
    // 2. 결과 예시
    const result = {
      overallScore: 85,
      emotionScore: 'neutral',
      misunderstandingRisk: 'low',
      suggestions: [
        {
          suggestion: '더 명확한 표현을 사용하세요.',
          type: 'clarity'
        }
      ],
      improvedVersion: emailText // 실제론 AI 결과, 일단 원본 반환
    };

    const review = new Review({ 
      user: req.user.userId, 
      emailContent: emailText, 
      result 
    });
    
    await review.save();
    
    // 프론트엔드가 기대하는 형태로 응답
    res.status(201).json({
      ...review.toObject(),
      improvedVersion: result.improvedVersion,
      suggestions: result.suggestions
    });
    
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// 내 분석 히스토리
router.get('/history', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Review history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 단건 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.userId });
    if (!review) return res.status(404).json({ message: 'Not found' });
    res.json(review);
  } catch (error) {
    console.error('Review fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;