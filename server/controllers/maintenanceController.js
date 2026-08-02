const { getStore, getIsConnected } = require('../config/db');
const Maintenance = require('../models/Maintenance');

// Get all maintenance tickets
const getMaintenance = async (req, res) => {
  try {
    const isConnected = getIsConnected();
    let records = [];

    if (isConnected) {
      records = await Maintenance.find().sort({ createdAt: -1 });
    } else {
      records = [...getStore().maintenanceRecords];
    }

    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch maintenance records: ' + err.message });
  }
};

// Create new Maintenance Record
const createMaintenance = async (req, res) => {
  try {
    const { panelId, issue, assignedEngineer, status, scheduledDate, priority, notes } = req.body;
    if (!panelId || !issue || !assignedEngineer || !scheduledDate) {
      return res.status(400).json({ success: false, message: 'Panel ID, Issue, Engineer, and Scheduled Date are required.' });
    }

    const isConnected = getIsConnected();
    const newRecord = {
      _id: 'MNT-' + Math.floor(1000 + Math.random() * 9000),
      panelId,
      issue,
      assignedEngineer,
      status: status || 'Scheduled',
      scheduledDate,
      completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : null,
      priority: priority || 'Medium',
      notes: notes || ''
    };

    if (isConnected) {
      const dbRecord = new Maintenance(newRecord);
      await dbRecord.save();
      return res.status(201).json({ success: true, data: dbRecord });
    } else {
      getStore().maintenanceRecords.unshift(newRecord);
      return res.status(201).json({ success: true, data: newRecord });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add maintenance record: ' + err.message });
  }
};

// Update Maintenance Status & details
const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedEngineer, notes, completedDate } = req.body;
    const isConnected = getIsConnected();

    const updatePayload = {
      ...(status && { status }),
      ...(assignedEngineer && { assignedEngineer }),
      ...(notes !== undefined && { notes }),
      ...(completedDate !== undefined ? { completedDate } : (status === 'Completed' ? { completedDate: new Date().toISOString().split('T')[0] } : {}))
    };

    if (isConnected) {
      const updated = await Maintenance.findByIdAndUpdate(id, updatePayload, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Maintenance record not found.' });
      }
      return res.json({ success: true, data: updated });
    } else {
      const index = getStore().maintenanceRecords.findIndex(m => m._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Maintenance record not found.' });
      }
      getStore().maintenanceRecords[index] = { ...getStore().maintenanceRecords[index], ...updatePayload };
      return res.json({ success: true, data: getStore().maintenanceRecords[index] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update maintenance: ' + err.message });
  }
};

// Delete Maintenance Record
const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    if (isConnected) {
      await Maintenance.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Maintenance record deleted.' });
    } else {
      const index = getStore().maintenanceRecords.findIndex(m => m._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Record not found.' });
      }
      getStore().maintenanceRecords.splice(index, 1);
      return res.json({ success: true, message: 'Maintenance record deleted.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete record: ' + err.message });
  }
};

module.exports = { getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance };
