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
  //console.log("백엔드 수신값:", { tone, analysisLevel, autoCorrection });

  const correctionInstruction = autoCorrection
    ? '4. 해당 표현을 보다 정중하고 적절한 문장으로 고쳐 improvedVersion 필드에 제시해줘.'
    : '4. 수정 제안은 하지 마. improvedVersion 필드는 null 또는 빈 문자열로 둬.';

  const prompt = `
You are a Korean business communication expert. You MUST respond in perfect Korean only. No English words or sentences are allowed in your output.


Your task is to analyze and improve the tone, clarity, and appropriateness of the following email, written in Korean, according to the user's preferences.

Please respond in the following strict JSON format:
{
  "improvedVersion": "The entire email rewritten in more polite, natural, and clear Korean",
  "suggestions": [
    {
      "type": "warning or info",
      "text": "Explanation of the issue in the original sentence",
      "suggestion": "Suggested alternative sentence"
    }
  ],
  "toneFeedback": "Overall evaluation of the tone and communication effectiveness",
  "overallScore": 1~100 (based on clarity, professionalism, and tone)
}

Guidelines:
- Keep the original meaning of each sentence, but rewrite them in a more polite, natural, and fluent Korean business style.
- Avoid repeating exactly the same sentence in the improved version unless it is already perfect — always aim to improve.
- Do not include explanations or any additional text outside the JSON block.
- Suggestions should align with modern, professional Korean email etiquette.

User settings:
- Tone: '${tone}'
- Analysis Level: '${analysisLevel}' (${analysisLevel === 'basic' ? 'Simple analysis focusing on misunderstandings' : analysisLevel === 'detailed' ? 'Detailed analysis including emotional tone and clarity' : 'In-depth analysis including context and intent'})
- Auto Correction: ${autoCorrection ? 'Enabled' : 'Disabled'}

Original Email:
"""
${emailText}
"""

⚠️ Respond ONLY in Korean.
- Do not use English words or phrases (e.g. “is more polite”, “instead of”, “clearer tone”).
- All fields in the JSON response (text, suggestion, toneFeedback, etc) MUST be written entirely in Korean.
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