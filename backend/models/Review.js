const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailContent: { type: String, required: true },
  result: {
    overallScore: Number,
    emotionScore: String,
    misunderstandingRisk: String,
    suggestions: [{
      suggestion: String,
      type: String,
      priority: String
    }],
    improvedVersion: String,
    sentenceAnalysis: [{
      original: String,
      improved: String,
      suggestion: String,
      type: String
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);