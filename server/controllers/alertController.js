const { getStore, getIsConnected } = require('../config/db');
const Alert = require('../models/Alert');

// Get all alerts with status/severity filters
const getAlerts = async (req, res) => {
  try {
    const { status, severity } = req.query;
    const isConnected = getIsConnected();
    let data = [];

    if (isConnected) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (severity && severity !== 'All') query.severity = severity;
      data = await Alert.find(query).sort({ createdAt: -1 });
    } else {
      data = [...getStore().alerts];
      if (status && status !== 'All') {
        data = data.filter(a => a.status.toLowerCase() === status.toLowerCase());
      }
      if (severity && severity !== 'All') {
        data = data.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
      }
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch alerts: ' + err.message });
  }
};

// Update Alert status (Active, Acknowledged, Resolved)
const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const isConnected = getIsConnected();

    if (isConnected) {
      const updated = await Alert.findOneAndUpdate(
        { $or: [{ _id: id }, { _id: id }] },
        { status },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Alert not found.' });
      }
      return res.json({ success: true, data: updated });
    } else {
      const index = getStore().alerts.findIndex(a => a._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Alert not found.' });
      }
      getStore().alerts[index].status = status;
      return res.json({ success: true, data: getStore().alerts[index] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update alert: ' + err.message });
  }
};

// Create new alert
const createAlert = async (req, res) => {
  try {
    const { panelId, type, severity, description } = req.body;
    const isConnected = getIsConnected();

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newAlert = {
      _id: 'ALT-' + Date.now().toString().slice(-6),
      panelId: panelId || 'SP-101',
      type: type || 'Sensor Failure',
      severity: severity || 'Warning',
      description: description || 'Anomaly detected during sensor routine telemetry scan.',
      timestamp,
      status: 'Active'
    };

    if (isConnected) {
      const dbAlert = new Alert(newAlert);
      await dbAlert.save();
      return res.status(201).json({ success: true, data: dbAlert });
    } else {
      getStore().alerts.unshift(newAlert);
      return res.status(201).json({ success: true, data: newAlert });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to trigger alert: ' + err.message });
  }
};

module.exports = { getAlerts, updateAlertStatus, createAlert };
