const mongoose = require('mongoose');

const replyGuideSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title:    { type: String, required: true },
  situation:{ type: String },
  content:  { type: String, required: true },
  isMetadata: { type: Boolean, default: false },
  templateVersion: { type: String },
  lastUpdated: { type: Date }
});

module.exports = mongoose.model('ReplyGuide', replyGuideSchema);