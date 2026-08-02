const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  panelId: { type: String, required: true },
  timestamp: { type: String, required: true },
  date: { type: String, required: true },
  powerOutputKW: { type: Number, required: true },
  voltageV: { type: Number, required: true },
  currentA: { type: Number, required: true },
  temperatureC: { type: Number, required: true },
  irradianceWM2: { type: Number, required: true },
  efficiencyPct: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SensorData', sensorDataSchema);
