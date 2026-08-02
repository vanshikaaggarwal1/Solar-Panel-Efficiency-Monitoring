const { getStore, getIsConnected } = require('../config/db');
const SolarPanel = require('../models/SolarPanel');

// Get all panels with search, filter, and sort
const getPanels = async (req, res) => {
  try {
    const { search, status, location, sortBy, sortOrder } = req.query;
    const isConnected = getIsConnected();
    let panels = [];

    if (isConnected) {
      let query = {};
      if (status && status !== 'All') {
        query.status = status;
      }
      if (location && location !== 'All') {
        query.location = { $regex: location, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { panelId: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.panelId = 1;
      }

      panels = await SolarPanel.find(query).sort(sortOptions);
    } else {
      panels = [...getStore().solarPanels];

      if (search) {
        const queryLower = search.toLowerCase();
        panels = panels.filter(p =>
          p.panelId.toLowerCase().includes(queryLower) ||
          p.model.toLowerCase().includes(queryLower) ||
          p.location.toLowerCase().includes(queryLower)
        );
      }

      if (status && status !== 'All') {
        panels = panels.filter(p => p.status.toLowerCase() === status.toLowerCase());
      }

      if (location && location !== 'All') {
        panels = panels.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
      }

      if (sortBy) {
        panels.sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
          if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      }
    }

    res.json({ success: true, count: panels.length, data: panels });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch panels: ' + err.message });
  }
};

// Get single panel by ID
const getPanelById = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();
    let panel = null;

    if (isConnected) {
      panel = await SolarPanel.findOne({ $or: [{ _id: id }, { panelId: id }] });
    } else {
      panel = getStore().solarPanels.find(p => p._id === id || p.panelId === id);
    }

    if (!panel) {
      return res.status(404).json({ success: false, message: 'Solar panel not found.' });
    }

    res.json({ success: true, data: panel });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving panel: ' + err.message });
  }
};

// Create new Solar Panel
const createPanel = async (req, res) => {
  try {
    const { panelId, model, type, status, installationDate, location, ratedCapacityKW, tiltAngleDeg, azimuthDeg } = req.body;
    if (!panelId || !model || !type || !location || !ratedCapacityKW) {
      return res.status(400).json({ success: false, message: 'Missing required panel configuration fields.' });
    }

    const isConnected = getIsConnected();

    const newPanelData = {
      panelId,
      model,
      type,
      status: status || 'Active',
      installationDate: installationDate || new Date().toISOString().split('T')[0],
      location,
      ratedCapacityKW: parseFloat(ratedCapacityKW),
      currentOutputKW: parseFloat((ratedCapacityKW * 0.92).toFixed(2)),
      efficiency: 22.5,
      temperatureC: 36.0,
      voltageV: 48.0,
      currentA: 80.0,
      irradianceWM2: 950,
      batteryStatusPct: 95,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      tiltAngleDeg: tiltAngleDeg ? parseInt(tiltAngleDeg) : 30,
      azimuthDeg: azimuthDeg ? parseInt(azimuthDeg) : 180
    };

    if (isConnected) {
      const dbPanel = new SolarPanel(newPanelData);
      await dbPanel.save();
      return res.status(201).json({ success: true, data: dbPanel });
    } else {
      const exists = getStore().solarPanels.some(p => p.panelId.toLowerCase() === panelId.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: `Panel ID '${panelId}' already exists.` });
      }
      const created = { _id: panelId, ...newPanelData };
      getStore().solarPanels.push(created);
      return res.status(201).json({ success: true, data: created });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create solar panel: ' + err.message });
  }
};

// Update Solar Panel
const updatePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    if (isConnected) {
      const updated = await SolarPanel.findOneAndUpdate({ $or: [{ _id: id }, { panelId: id }] }, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Panel not found for update.' });
      }
      return res.json({ success: true, data: updated });
    } else {
      const index = getStore().solarPanels.findIndex(p => p._id === id || p.panelId === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Panel not found.' });
      }
      getStore().solarPanels[index] = { ...getStore().solarPanels[index], ...req.body };
      return res.json({ success: true, data: getStore().solarPanels[index] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update panel: ' + err.message });
  }
};

// Delete Solar Panel
const deletePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    if (isConnected) {
      await SolarPanel.findOneAndDelete({ $or: [{ _id: id }, { panelId: id }] });
      return res.json({ success: true, message: 'Solar panel removed successfully.' });
    } else {
      const index = getStore().solarPanels.findIndex(p => p._id === id || p.panelId === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Panel not found.' });
      }
      getStore().solarPanels.splice(index, 1);
      return res.json({ success: true, message: 'Solar panel removed successfully.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete panel: ' + err.message });
  }
};

module.exports = { getPanels, getPanelById, createPanel, updatePanel, deletePanel };
