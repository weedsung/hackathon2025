// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  department: String,

  tone: {
    type: String,
    enum: ['정중하게', '친근하게', '전문적으로'],
    default: '정중하게'
  },

  notification: {
    emailAlert: { type: Boolean, default: true },
    browserAlert: { type: Boolean, default: false },
    weeklyReport: { type: Boolean, default: true }
  },

  aiSettings: {
    analysisLevel: { type: String, default: '상세' },  
    autoFix: { type: Boolean, default: true }
  },

  dataSettings: {
    historyRetention: { type: Number, default: 30 }, 
    exportedAt: Date
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);