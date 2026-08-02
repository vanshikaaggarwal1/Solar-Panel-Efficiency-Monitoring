const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  panelId: { type: String, required: true },
  issue: { type: String, required: true },
  assignedEngineer: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled' },
  scheduledDate: { type: String, required: true },
  completedDate: { type: String, default: null },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
