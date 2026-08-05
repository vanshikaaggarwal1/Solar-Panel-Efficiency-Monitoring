const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  _id: { type: String },
  title: { type: String, required: true },
  period: { type: String, enum: ['Day', 'Week', 'Month', 'Year'], required: true },
  periodRange: { type: String, required: true },
  generatedDate: { type: String, required: true },
  totalEnergyGeneratedKWh: { type: Number, required: true },
  avgEfficiencyPct: { type: Number, required: true },
  activePanelsCount: { type: Number, required: true },
  carbonSavedKg: { type: Number, required: true },
  revenueUsd: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
