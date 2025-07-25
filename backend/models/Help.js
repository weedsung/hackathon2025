// backend/models/Help.js
const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
  type: { type: String, enum: ['guide', 'faq', 'video'], required: true },
  title: String,          
  content: String,        
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Help', helpSchema);