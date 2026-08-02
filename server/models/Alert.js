const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  panelId: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['Critical', 'Warning', 'Info'], default: 'Warning' },
  description: { type: String, required: true },
  timestamp: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Acknowledged', 'Resolved'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
