// backend/models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: String,
  issues: [String],
  suggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  originalText: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    enum: ["정중하게", "친근하게", "전문적으로"],
    default: "정중하게"
  },
  reviewResult: {
    type: Object,
    required: true
  },
});

module.exports = mongoose.model("Review", reviewSchema);
