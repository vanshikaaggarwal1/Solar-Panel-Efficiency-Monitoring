const { getStore, getIsConnected } = require('../config/db');
const SensorData = require('../models/SensorData');

// Get sensor history for charts
const getSensorHistory = async (req, res) => {
  try {
    const { panelId, limit } = req.query;
    const isConnected = getIsConnected();
    let data = [];

    if (isConnected) {
      let query = {};
      if (panelId) query.panelId = panelId;
      data = await SensorData.find(query).sort({ createdAt: -1 }).limit(limit ? parseInt(limit) : 50);
    } else {
      data = [...getStore().sensorData];
      if (panelId) {
        data = data.filter(s => s.panelId === panelId);
      }
      if (limit) {
        data = data.slice(0, parseInt(limit));
      }
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch sensor telemetry: ' + err.message });
  }
};

// Insert new telemetry tick (used by live simulation or external sensors)
const addTelemetryTick = async (req, res) => {
  try {
    const { panelId, powerOutputKW, voltageV, currentA, temperatureC, irradianceWM2, efficiencyPct } = req.body;
    const isConnected = getIsConnected();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toISOString().split('T')[0];

    const tick = {
      _id: 'sns-' + Date.now(),
      panelId: panelId || 'SP-101',
      timestamp,
      date,
      powerOutputKW: parseFloat(powerOutputKW || 3.8),
      voltageV: parseFloat(voltageV || 48.0),
      currentA: parseFloat(currentA || 79.0),
      temperatureC: parseFloat(temperatureC || 38.0),
      irradianceWM2: parseFloat(irradianceWM2 || 950),
      efficiencyPct: parseFloat(efficiencyPct || 22.0)
    };

    if (isConnected) {
      const dbSensor = new SensorData(tick);
      await dbSensor.save();
    } else {
      getStore().sensorData.unshift(tick);
      if (getStore().sensorData.length > 200) {
        getStore().sensorData.pop();
      }
    }

    res.status(201).json({ success: true, data: tick });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to insert telemetry: ' + err.message });
  }
};

module.exports = { getSensorHistory, addTelemetryTick };
