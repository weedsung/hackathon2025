// backend/models/History.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  title: { type: String, required: true },           // 메일 제목
  content: { type: String, required: true },         // 본문 요약/전문
  recipient: { type: String },                       // 수신자 이름/직책 등
  sentAt: { type: Date },                            // 발송일시
  score: { type: Number },                           // AI 평가 점수 
  status: { type: String, enum: ['발송됨', '임시저장'], default: '발송됨' },
  category: { type: String },                        // 템플릿 사용 여부나 분류
  templateTitle: { type: String },                   // 사용한 템플릿 제목

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("History", historySchema);
