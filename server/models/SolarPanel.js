const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  _id: { type: String },
  panelId: { type: String, required: true, unique: true, index: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Degraded', 'Offline', 'Maintenance'], default: 'Active', index: true },
  installationDate: { type: String, required: true },
  location: { type: String, required: true, index: true },
  ratedCapacityKW: { type: Number, required: true, min: 0 },
  currentOutputKW: { type: Number, default: 0, min: 0 },
  efficiency: { type: Number, default: 0, min: 0, max: 100 },
  temperatureC: { type: Number, default: 25 },
  voltageV: { type: Number, default: 0 },
  currentA: { type: Number, default: 0 },
  irradianceWM2: { type: Number, default: 0 },
  batteryStatusPct: { type: Number, default: 100, min: 0, max: 100 },
  lastMaintenanceDate: { type: String, default: '' },
  tiltAngleDeg: { type: Number, default: 30 },
  azimuthDeg: { type: Number, default: 180 }
}, { timestamps: true });

solarPanelSchema.index({ status: 1, location: 1 });

module.exports = mongoose.model('SolarPanel', solarPanelSchema);
