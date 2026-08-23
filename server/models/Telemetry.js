const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  _id: { type: String },
  panelId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  plantId: { type: String, default: 'PLANT-01', index: true },
  power: { type: Number, required: true }, // Power output in kW
  energy: { type: Number, required: true }, // Accumulated energy in kWh
  voltage: { type: Number, required: true }, // Terminal Voltage in V
  current: { type: Number, required: true }, // Current in A
  irradiance: { type: Number, required: true }, // Solar Irradiance in W/m²
  temperature: { type: Number, required: true }, // Panel Temperature in °C
  efficiency: { type: Number, required: true }, // Conversion Efficiency %
  status: { 
    type: String, 
    enum: ['Online', 'Offline', 'Degraded', 'Fault'], 
    default: 'Online', 
    index: true 
  },
  faultDetails: { type: mongoose.Schema.Types.Mixed, default: null },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

telemetrySchema.index({ userId: 1, timestamp: -1 });
telemetrySchema.index({ panelId: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
