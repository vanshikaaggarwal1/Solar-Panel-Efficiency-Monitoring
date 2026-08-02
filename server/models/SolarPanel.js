const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  panelId: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Degraded', 'Offline', 'Maintenance'], default: 'Active' },
  installationDate: { type: String, required: true },
  location: { type: String, required: true },
  ratedCapacityKW: { type: Number, required: true },
  currentOutputKW: { type: Number, default: 0 },
  efficiency: { type: Number, default: 0 },
  temperatureC: { type: Number, default: 25 },
  voltageV: { type: Number, default: 0 },
  currentA: { type: Number, default: 0 },
  irradianceWM2: { type: Number, default: 0 },
  batteryStatusPct: { type: Number, default: 100 },
  lastMaintenanceDate: { type: String, default: '' },
  tiltAngleDeg: { type: Number, default: 30 },
  azimuthDeg: { type: Number, default: 180 }
}, { timestamps: true });

module.exports = mongoose.model('SolarPanel', solarPanelSchema);
