require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 기본 라우터
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// GPT 리뷰 라우터
app.post("/api/review", async (req, res) => {
  const { emailText, tone } = req.body;

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

이메일 원문:
"${emailText}"
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 필요 시 "gpt-4"로 변경 가능
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0].message.content;

    // GPT 응답을 JSON으로 파싱
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

app.listen(port, () => {
  console.log(`✅ Backend server running at http://localhost:${port}`);
});
