const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => 'usr-' + Date.now() + Math.random().toString(36).substring(2, 6) },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Manager', 'Operator', 'Technician', 'Viewer', 'Personal', 'User', 'Administrator'], 
    default: 'Admin' 
  },
  accountType: { 
    type: String, 
    enum: ['personal', 'business', 'organisation', 'enterprise'], 
    default: 'personal' 
  },
  organizationId: { type: String, default: null, index: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdBy: {
    type: String,
    default: null
  },

  createdVia: {
    type: String,
    enum: ['self-registration', 'admin'],
    default: 'self-registration'
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

  // Business / Enterprise / Organisation
  organizationName: { type: String, default: '' },
  industry: { type: String, default: '' },
  solarSites: { type: String, default: '' },
  totalCapacity: { type: String, default: '' },
  users: { type: String, default: '' },
  organizationType: { type: String, default: '' },
  notificationsEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

