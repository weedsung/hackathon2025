require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.log("⚠️ OPENAI_API_KEY not found. AI features will be disabled.");
}

// 라우트 파일 불러오기
const authRoutes = require('./routes/auth');
// const reviewRoutes     = require('./routes/review'); // 임시 주석 처리
const replyGuideRoutes = require('./routes/replyGuide');
const historyRoutes = require('./routes/history');
const userRoutes = require('./routes/user').router;
const helpRoutes = require('./routes/help');
const dbConnect = require('./config/dbConnect');

// 라우트 등록
app.use('/api/auth', authRoutes);
// app.use('/api/review',      reviewRoutes); // 임시 주석 처리 - 인증 없는 라우트 사용
app.use('/api/reply-guide', replyGuideRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/help', helpRoutes);

// 기본 라우터
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// GPT 리뷰 라우터
app.post("/api/review", async (req, res) => {
  const { emailText, tone, analysisLevel, autoCorrection } = req.body;
  
  if (!emailText || !emailText.trim()) {
    return res.status(400).json({ error: "이메일 내용이 필요합니다." });
  }

  const systemPrompt = `You are an expert email writing assistant specializing in Korean business communication. Your task is to analyze and improve email content.

ANALYSIS REQUIREMENTS:
- Tone: ${tone || 'professional'}
- Analysis Level: ${analysisLevel || 'detailed'}
- Auto Correction: ${autoCorrection ? 'enabled' : 'disabled'}

RESPONSE FORMAT (JSON only):
{
  "improvedVersion": "Complete improved email in Korean",
  "suggestions": [
    {
      "suggestion": "Korean improvement suggestion",
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

IMPORTANT: 
- Respond ONLY in JSON format. All text content must be in Korean.
- Always provide improvedVersion regardless of autoCorrection setting.
- When autoCorrection is disabled, still provide suggestions but keep improvedVersion as the original text if no improvements are needed.`;

  const userPrompt = `Analyze and improve this Korean email:

${emailText}

Provide comprehensive analysis and improvements following the specified JSON format.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const raw = response.choices[0].message.content;

    let parsed;
    try {
      // 더 강력한 JSON 파싱 함수
      function extractAndParseJSON(text) {
        // 1. JSON 블록 추출 시도
        const jsonBlockPatterns = [
          /```json\s*([\s\S]*?)\s*```/,
          /```\s*([\s\S]*?)\s*```/,
          /\{[\s\S]*\}/  // 중괄호로 둘러싸인 JSON 찾기
        ];
        
        for (const pattern of jsonBlockPatterns) {
          const match = text.match(pattern);
          if (match) {
            try {
              const jsonStr = match[1] || match[0];
              return JSON.parse(jsonStr);
            } catch (e) {
              console.log('패턴 매칭 실패, 다음 패턴 시도:', e.message);
              continue;
            }
          }
        }
        
        // 2. 직접 JSON 파싱 시도
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error('모든 JSON 파싱 시도 실패');
        }
      }
      
      parsed = extractAndParseJSON(raw);
      
      // 필수 필드 검증 및 기본값 설정
      const result = {
        suggestions: parsed.suggestions || [],
        improvedVersion: parsed.improvedVersion || emailText
      };
      
      res.json(result);
      
    } catch (err) {
      console.error("⚠️ JSON 파싱 실패:", raw);
      console.error("파싱 에러:", err.message);
      
      // 더 안전한 fallback 응답
      const fallbackResult = {
        suggestions: [
          {
            suggestion: 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.',
            type: 'error'
          }
        ],
        improvedVersion: emailText
      };
      
      res.json(fallbackResult);
    }

  } catch (error) {
    console.error("❌ GPT 호출 실패:", error);
    res.status(500).json({ 
      error: "GPT API 호출 실패",
      suggestions: [
        {
          suggestion: 'AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          type: 'error'
        }
      ],
      improvedVersion: emailText
    });
  }
});

// DB 연결 후 서버 시작
(async () => {
  try {
    await dbConnect();
    console.log('✅ MongoDB 연결 성공!');
    app.listen(port, () => {
      console.log(`✅ Backend server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ MongoDB 연결 실패:', err);
    app.listen(port, () => {
      console.log(`✅ Backend server running at http://localhost:${port} (without DB)`);
    });
  }
})();