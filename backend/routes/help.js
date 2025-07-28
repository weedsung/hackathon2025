const express = require('express');
const router = express.Router();

router.get('/faq', (req, res) => {
  res.json([
    { question: '메일 검토는 어떻게 작동하나요?', answer: '...' },
    // ... 기타 FAQ
  ]);
});

router.get('/guide', (req, res) => {
  res.json([
    { title: '메일 검토 기능 사용하기', steps: ['...', '...'] },
    // ... 기타 가이드
  ]);
});

module.exports = router;