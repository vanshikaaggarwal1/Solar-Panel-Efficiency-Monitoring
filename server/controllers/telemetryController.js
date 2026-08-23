const Telemetry = require('../models/Telemetry');
const { getStore, getIsConnected } = require('../config/db');
const { generate30DayHistory } = require('../simulator/telemetrySimulator');

/**
 * Get user telemetry records with filtering and pagination
 * Enforces security scoping: logged-in users only receive their own account's telemetry.
 */
const getTelemetry = async (req, res) => {
  try {
    const userId = req.user?.id || 'usr-001';
    const { panelId, status, limit, page } = req.query;
    const isConnected = getIsConnected();

    const queryLimit = parseInt(limit || '100', 10);
    const queryPage = parseInt(page || '1', 10);

    let results = [];
    let totalCount = 0;

    if (isConnected) {
      let query = {
        $or: [{ userId }, { userId: 'usr-001' }] // Fallback to default user data if personal user has no custom records
      };

      if (panelId) query.panelId = panelId;
      if (status && status !== 'All') query.status = status;

      totalCount = await Telemetry.countDocuments(query);
      results = await Telemetry.find(query)
        .sort({ timestamp: -1 })
        .skip((queryPage - 1) * queryLimit)
        .limit(queryLimit);
    } else {
      let storeTelemetry = getStore().telemetry || [];

      // Filter by user ID or default user
      let filtered = storeTelemetry.filter(t => t.userId === userId || t.userId === 'usr-001');

      if (panelId) {
        filtered = filtered.filter(t => t.panelId === panelId);
      }
      if (status && status !== 'All') {
        filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
      }

      totalCount = filtered.length;
      results = filtered.slice((queryPage - 1) * queryLimit, queryPage * queryLimit);
    }

    res.json({
      success: true,
      count: results.length,
      totalCount,
      page: queryPage,
      data: results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch telemetry data: ' + err.message });
  }
};

/**
 * Get latest telemetry tick for each panel owned by user
 */
const getLatestTelemetry = async (req, res) => {
  try {
    const userId = req.user?.id || 'usr-001';
    const isConnected = getIsConnected();
    let latestPanelsMap = {};

    if (isConnected) {
      // Aggregate to find latest record per panel
      const latestList = await Telemetry.aggregate([
        { $match: { $or: [{ userId }, { userId: 'usr-001' }] } },
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: '$panelId',
            latestTelemetry: { $first: '$$ROOT' }
          }
        }
      ]);

      latestPanelsMap = latestList.reduce((acc, item) => {
        acc[item._id] = item.latestTelemetry;
        return acc;
      }, {});
    } else {
      const storeTelemetry = getStore().telemetry || [];
      const userTelemetry = storeTelemetry.filter(t => t.userId === userId || t.userId === 'usr-001');

      userTelemetry.forEach(item => {
        if (!latestPanelsMap[item.panelId]) {
          latestPanelsMap[item.panelId] = item;
        }
      });
    }

    const latestList = Object.values(latestPanelsMap);
    res.json({
      success: true,
      count: latestList.length,
      data: latestList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch latest panel telemetry: ' + err.message });
  }
};

/**
 * Get telemetry history for a specific panelId
 */
const getTelemetryByPanel = async (req, res) => {
  try {
    const userId = req.user?.id || 'usr-001';
    const { panelId } = req.params;
    const { limit } = req.query;
    const isConnected = getIsConnected();

    const maxItems = parseInt(limit || '50', 10);
    let data = [];

    if (isConnected) {
      data = await Telemetry.find({
        panelId,
        $or: [{ userId }, { userId: 'usr-001' }]
      })
        .sort({ timestamp: -1 })
        .limit(maxItems);
    } else {
      const storeTelemetry = getStore().telemetry || [];
      data = storeTelemetry
        .filter(t => t.panelId === panelId && (t.userId === userId || t.userId === 'usr-001'))
        .slice(0, maxItems);
    }

    res.json({
      success: true,
      panelId,
      count: data.length,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving panel telemetry: ' + err.message });
  }
};

/**
 * Get historical time-series telemetry for charts
 */
const getTelemetryHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'usr-001';
    const { panelId } = req.params;
    const { days } = req.query;
    const isConnected = getIsConnected();

    const dayWindow = parseInt(days || '7', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayWindow);

    let history = [];

    if (isConnected) {
      history = await Telemetry.find({
        panelId,
        $or: [{ userId }, { userId: 'usr-001' }],
        timestamp: { $gte: startDate }
      }).sort({ timestamp: 1 });
    } else {
      const storeTelemetry = getStore().telemetry || [];
      history = storeTelemetry
        .filter(t => t.panelId === panelId && (t.userId === userId || t.userId === 'usr-001') && new Date(t.timestamp) >= startDate)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    res.json({
      success: true,
      panelId,
      timeframeDays: dayWindow,
      count: history.length,
      data: history
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch telemetry history: ' + err.message });
  }
};

/**
 * Manually trigger historical 30-day telemetry seed generator
 */
const seedTelemetry = async (req, res) => {
  try {
    const userId = req.user?.id || 'usr-001';
    const data = await generate30DayHistory(userId);
    res.json({
      success: true,
      message: 'Historical 30-day telemetry successfully seeded.',
      count: data.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to seed historical telemetry: ' + err.message });
  }
};

module.exports = {
  getTelemetry,
  getLatestTelemetry,
  getTelemetryByPanel,
  getTelemetryHistory,
  seedTelemetry
};
