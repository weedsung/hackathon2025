const express = require('express');
const Review = require('../models/Review');
const { auth } = require('./user');
const OpenAI = require('openai');
const router = express.Router();

// OpenAI 클라이언트 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GPT API를 통한 이메일 검토 함수
async function analyzeEmailWithGPT(emailText, tone, analysisLevel, autoCorrection) {
  try {
    const systemPrompt = `You are an expert email writing assistant specializing in Korean business communication. Your task is to analyze and improve email content.

ANALYSIS REQUIREMENTS:
- Tone: ${tone || 'professional'}
- Analysis Level: ${analysisLevel || 'detailed'}
- Auto Correction: ${autoCorrection ? 'enabled' : 'disabled'}

RESPONSE FORMAT (JSON only):
{
  "overallScore": number (0-100),
  "emotionScore": "positive|neutral|negative",
  "misunderstandingRisk": "low|medium|high",
  "suggestions": [
    {
      "suggestion": "Korean improvement suggestion",
      "type": "clarity|tone|grammar|structure|politeness",
      "priority": "high|medium|low"
    }
  ],
  "improvedVersion": "Complete improved email in Korean",
  "sentenceAnalysis": [
    {
      "original": "Original sentence",
      "improved": "Improved sentence",
      "suggestion": "Korean explanation of improvement",
      "type": "clarity|tone|grammar|structure|politeness"
    }
  ]
}

ANALYSIS CRITERIA:
1. Clarity and conciseness
2. Professional tone appropriate for Korean business culture
3. Grammar and spelling accuracy
4. Logical structure and flow
5. Politeness levels (존댓말/반말)
6. Cultural appropriateness
7. Clear call-to-action

IMPORTANT: Respond ONLY in JSON format. All text content must be in Korean.`;

    const userPrompt = `Analyze and improve this Korean email:

${emailText}

Provide comprehensive analysis and improvements following the specified JSON format.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 3000
    });

    const response = completion.choices[0].message.content;
    
    // JSON 파싱 시도
    try {
      const parsedResponse = JSON.parse(response);
      
      // 필수 필드 검증 및 기본값 설정
      return {
        overallScore: parsedResponse.overallScore || 70,
        emotionScore: parsedResponse.emotionScore || 'neutral',
        misunderstandingRisk: parsedResponse.misunderstandingRisk || 'medium',
        suggestions: parsedResponse.suggestions || [],
        improvedVersion: parsedResponse.improvedVersion || emailText,
        sentenceAnalysis: parsedResponse.sentenceAnalysis || []
      };
    } catch (parseError) {
      console.error('GPT 응답 파싱 실패:', parseError);
      console.error('원본 응답:', response);
      
      // 파싱 실패 시 기본 응답 반환
      return {
        overallScore: 70,
        emotionScore: 'neutral',
        misunderstandingRisk: 'medium',
        suggestions: [
          {
            suggestion: 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.',
            type: 'error',
            priority: 'high'
          }
        ],
        improvedVersion: emailText,
        sentenceAnalysis: []
      };
    }
  } catch (error) {
    console.error('GPT API 호출 실패:', error);
    throw new Error('AI 분석 서비스에 일시적인 문제가 발생했습니다.');
  }
}

// 메일 검토 요청 (AI 연동)
router.post('/', auth, async (req, res) => {
  try {
    const { emailText, tone, analysisLevel, autoCorrection } = req.body;
    
    if (!emailText || !emailText.trim()) {
      return res.status(400).json({ message: 'emailText is required' });
    }

    // GPT API 호출
    const aiResult = await analyzeEmailWithGPT(emailText, tone, analysisLevel, autoCorrection);

    const review = new Review({ 
      user: req.user.userId, 
      emailContent: emailText, 
      result: aiResult
    });
    
    await review.save();
    
    // 프론트엔드가 기대하는 형태로 응답
    res.status(201).json({
      ...review.toObject(),
      improvedVersion: aiResult.improvedVersion,
      suggestions: aiResult.suggestions,
      sentenceAnalysis: aiResult.sentenceAnalysis || []
    });
    
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error', 
      error: error.message 
    });
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