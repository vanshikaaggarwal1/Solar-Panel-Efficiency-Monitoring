const { getStore, getIsConnected } = require('../config/db');
const SensorData = require('../models/SensorData');
const SolarPanel = require('../models/SolarPanel');
const Alert = require('../models/Alert');

// Get sensor telemetry history filtered by panelId, date, or timeframe
const getSensorHistory = async (req, res) => {
  try {
    const { panelId, timeframe, limit } = req.query;
    const isConnected = getIsConnected();
    let data = [];

    if (isConnected) {
      let query = {};
      if (panelId) query.panelId = panelId;

      if (timeframe === 'Today' || timeframe === '24h') {
        const todayStr = new Date().toISOString().split('T')[0];
        query.date = todayStr;
      }

      data = await SensorData.find(query).sort({ createdAt: -1 }).limit(limit ? parseInt(limit) : 100);
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

// Insert new telemetry tick and trigger automated anomaly alerts in MongoDB
const addTelemetryTick = async (req, res) => {
  try {
    const { panelId, powerOutputKW, voltageV, currentA, temperatureC, irradianceWM2, efficiencyPct } = req.body;
    const isConnected = getIsConnected();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toISOString().split('T')[0];

    const targetPanelId = panelId || 'SP-101';
    const tempVal = parseFloat(temperatureC || 38.0);
    const voltVal = parseFloat(voltageV || 48.0);
    const effVal = parseFloat(efficiencyPct || 22.0);
    const powerVal = parseFloat(powerOutputKW || 3.8);

    const tick = {
      _id: 'sns-' + Date.now(),
      panelId: targetPanelId,
      timestamp,
      date,
      powerOutputKW: powerVal,
      voltageV: voltVal,
      currentA: parseFloat(currentA || 79.0),
      temperatureC: tempVal,
      irradianceWM2: parseFloat(irradianceWM2 || 950),
      efficiencyPct: effVal
    };

    if (isConnected) {
      const dbSensor = new SensorData(tick);
      await dbSensor.save();

      // Update current panel state in MongoDB
      await SolarPanel.findOneAndUpdate(
        { panelId: targetPanelId },
        {
          currentOutputKW: powerVal,
          temperatureC: tempVal,
          voltageV: voltVal,
          efficiency: effVal,
          irradianceWM2: tick.irradianceWM2
        }
      );

      // Automated Anomaly Alert Generation Rule Checks
      if (tempVal > 52) {
        await Alert.create({
          _id: 'ALT-' + Date.now().toString().slice(-6),
          panelId: targetPanelId,
          type: 'Overheating',
          severity: tempVal > 58 ? 'Critical' : 'Warning',
          description: `Surface temperature hotspot detected: ${tempVal}°C exceeded safety threshold.`,
          timestamp: `${date} ${timestamp}`,
          status: 'Active'
        });
      }

      if (effVal < 17) {
        await Alert.create({
          _id: 'ALT-' + Date.now().toString().slice(-6),
          panelId: targetPanelId,
          type: 'Low Efficiency',
          severity: 'Warning',
          description: `Efficiency conversion dropped to ${effVal}% below 18% target benchmark.`,
          timestamp: `${date} ${timestamp}`,
          status: 'Active'
        });
      }
    } else {
      getStore().sensorData.unshift(tick);
    }

    res.status(201).json({ success: true, data: tick });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to insert telemetry: ' + err.message });
  }
};

module.exports = { getSensorHistory, addTelemetryTick };
