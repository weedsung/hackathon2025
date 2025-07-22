// backend/models/ReplyGuide.js
const mongoose = require("mongoose");

const replyGuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true       // 템플릿 제목
  },
  content: {
    type: String,
    required: true       // 템플릿 본문
  },
  category: {
    type: String,
    enum: ["사과", "요청", "답변", "회의", "기타"],
    default: "기타"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ReplyGuide", replyGuideSchema);