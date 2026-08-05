const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  _id: { type: String },
  panelId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['Critical', 'Warning', 'Info'], default: 'Warning', index: true },
  description: { type: String, required: true },
  timestamp: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Acknowledged', 'Resolved'], default: 'Active', index: true }
}, { timestamps: true });

alertSchema.index({ status: 1, severity: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
