const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Solar Operator' },
  phone: { type: String, default: '' },
  location: { type: String, default: 'Solar Facility' },
  notificationsEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
