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
const authRoutes       = require('./routes/auth');
// const reviewRoutes     = require('./routes/review'); // 임시 주석 처리
const replyGuideRoutes = require('./routes/replyGuide');
const historyRoutes    = require('./routes/history');
const userRoutes       = require('./routes/user').router;
const helpRoutes       = require('./routes/help');
const dbConnect = require('./config/dbConnect');

// 라우트 등록
app.use('/api/auth',        authRoutes);
// app.use('/api/review',      reviewRoutes); // 임시 주석 처리 - 인증 없는 라우트 사용
app.use('/api/reply-guide', replyGuideRoutes);
app.use('/api/history',     historyRoutes);
app.use('/api/user',        userRoutes);
app.use('/api/help',        helpRoutes);

// 기본 라우터
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// GPT 리뷰 라우터
app.post("/api/review", async (req, res) => {
  const { emailText, tone, analysisLevel, autoCorrection } = req.body;
  //console.log("백엔드 수신값:", { tone, analysisLevel, autoCorrection });

  const correctionInstruction = autoCorrection
    ? '4. 해당 표현을 보다 정중하고 적절한 문장으로 고쳐 improvedVersion 필드에 제시해줘.'
    : '4. 수정 제안은 하지 마. improvedVersion 필드는 null 또는 빈 문자열로 둬.';

  const prompt = `
너는 이메일 커뮤니케이션 전문가야.

다음 이메일을 '${tone}' 톤으로 분석해서 아래 JSON 형식으로 응답해줘:

{
  "improvedVersion": "톤에 맞게 다시 쓴 이메일 문장",
  "suggestions": [
    {
      "type": "warning 또는 info",
      "text": "문제가 되는 문장 설명",
      "suggestion": "대안 문장"
    }
  ],
  "toneFeedback": "전반적인 톤에 대한 평가 문장",
  "overallScore": 1~100 사이의 숫자
}

요청 조건:
- 분석 수준: ${analysisLevel} (${analysisLevel === 'basic' ? '오해 소지 위주 간단 분석' : analysisLevel === 'detailed' ? '감정, 표현 포함 종합 분석' : '문맥과 관계까지 포함한 심층 분석'})
- 자동 수정: ${autoCorrection ? '예' : '아니오'}

아래 4가지 분석 항목을 모두 포함해줘:
1. 이메일 내용의 오해 가능성
2. 감정적인 표현이 있는지
3. 어조 분석 및 평가
${correctionInstruction}

이메일 원문:
"""
${emailText}
"""
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("⚠️ JSON 파싱 실패:", raw);
      return res.status(500).json({ error: "GPT 응답 JSON 파싱 실패", raw });
    }

    res.json(parsed);
  } catch (error) {
    console.error("❌ GPT 호출 실패:", error);
    res.status(500).json({ error: "GPT API 호출 실패" });
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
