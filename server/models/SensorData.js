const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  _id: { type: String },
  panelId: { type: String, required: true, index: true },
  timestamp: { type: String, required: true },
  date: { type: String, required: true, index: true },
  powerOutputKW: { type: Number, required: true },
  voltageV: { type: Number, required: true },
  currentA: { type: Number, required: true },
  temperatureC: { type: Number, required: true },
  irradianceWM2: { type: Number, required: true },
  efficiencyPct: { type: Number, required: true }
}, { timestamps: true });

sensorDataSchema.index({ panelId: 1, createdAt: -1 });
sensorDataSchema.index({ date: 1, createdAt: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);
