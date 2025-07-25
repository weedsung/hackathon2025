const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true }, // 해시 저장 권장
  name:       { type: String },
  department: { type: String },
  settings: {
    defaultTone:        { type: String, default: 'polite' },
    emailNotifications: { type: Boolean, default: true },
    browserNotifications: { type: Boolean, default: false },
    weeklyReport:       { type: Boolean, default: true },
    analysisLevel:      { type: String, default: 'detailed' },
    autoCorrection:     { type: Boolean, default: true },
    saveHistory:        { type: Boolean, default: true },
    dataRetention:      { type: String, default: '30' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);