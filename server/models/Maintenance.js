const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  _id: { type: String },
  panelId: { type: String, required: true, index: true },
  organizationId: { type: String, default: null, index: true },
  userId: { type: String, default: null, index: true },
  issue: { type: String, required: true },
  assignedEngineer: { type: String, required: true, index: true },
  status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled', index: true },
  scheduledDate: { type: String, required: true, index: true },
  completedDate: { type: String, default: null },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  notes: { type: String, default: '' }
}, { timestamps: true });

maintenanceSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
