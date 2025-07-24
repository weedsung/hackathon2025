const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['review', 'manual'], required: true },
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  recipient: { type: String },
  date:      { type: Date, default: Date.now },
  score:     { type: Number },
  status:    { type: String, enum: ['sent', 'draft'], default: 'sent' },
  template:  { type: String }
});

module.exports = mongoose.model('History', historySchema);