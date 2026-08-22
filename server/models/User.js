const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin' },
  accountType: {
    type: String,
    enum: ['personal', 'business', 'enterprise'],
    required: true
  },
  phone: { type: String, default: '' },
  siteName: { type: String, default: '' },
  location: { type: String, default: '' },
  solarInstalled: { type: String, default: '' },
  capacity: { type: String, default: '' },
  panelCount: { type: String, default: '' },
  panelType: { type: String, default: '' },
  battery: { type: String, default: '' },
  batteryType: { type: String, default: '' },
  gridConnected: { type: String, default: '' },

  // Business / Enterprise
  organizationName: { type: String, default: '' },
  industry: { type: String, default: '' },
  solarSites: { type: String, default: '' },
  totalCapacity: { type: String, default: '' },
  users: { type: String, default: '' },
  organizationType: { type: String, default: '' },
  notificationsEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
