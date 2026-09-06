const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  _id: { type: String, default: () => 'org-' + Date.now() + Math.random().toString(36).substring(2, 6) },
  name: { type: String, required: true },
  type: { type: String, enum: ['business', 'organisation'], default: 'business' },
  industry: { type: String, default: '' },
  solarSites: { type: String, default: '1' },
  totalCapacity: { type: String, default: '' },
  usersCount: { type: String, default: '1' },
  createdBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
