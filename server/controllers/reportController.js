const { getStore, getIsConnected } = require('../config/db');
const Report = require('../models/Report');

// Get all generated reports
const getReports = async (req, res) => {
  try {
    const isConnected = getIsConnected();
    let data = [];

    if (isConnected) {
      data = await Report.find().sort({ createdAt: -1 });
    } else {
      data = [...getStore().reports];
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports: ' + err.message });
  }
};

// Generate custom report by Period (Day, Week, Month, Year)
const generateReport = async (req, res) => {
  try {
    const { period, dateRange } = req.body;
    const reportPeriod = period || 'Month';
    const isConnected = getIsConnected();

    const todayStr = new Date().toISOString().split('T')[0];

    // Compute realistic analytics based on stored panel performance
    const panels = isConnected ? await require('../models/SolarPanel').find() : getStore().solarPanels;
    const activePanels = panels.filter(p => p.status === 'Active');

    let totalKWh = 0;
    let periodTitle = '';

    switch (reportPeriod) {
      case 'Day':
        totalKWh = parseFloat((activePanels.reduce((sum, p) => sum + (p.currentOutputKW * 6.5), 0)).toFixed(1));
        periodTitle = `Daily Solar Generation Report (${dateRange || todayStr})`;
        break;
      case 'Week':
        totalKWh = parseFloat((activePanels.reduce((sum, p) => sum + (p.currentOutputKW * 6.5 * 7), 0)).toFixed(1));
        periodTitle = `Weekly Solar Fleet Audit (${dateRange || 'Current Week'})`;
        break;
      case 'Year':
        totalKWh = parseFloat((activePanels.reduce((sum, p) => sum + (p.currentOutputKW * 6.5 * 365), 0)).toFixed(1));
        periodTitle = `Annual Environmental & Efficiency Audit (${dateRange || '2026'})`;
        break;
      case 'Month':
      default:
        totalKWh = parseFloat((activePanels.reduce((sum, p) => sum + (p.currentOutputKW * 6.5 * 30), 0)).toFixed(1));
        periodTitle = `Monthly Solar Yield & System Performance Report (${dateRange || 'August 2026'})`;
        break;
    }

    const avgEff = parseFloat((panels.reduce((sum, p) => sum + p.efficiency, 0) / (panels.length || 1)).toFixed(1));
    const carbonSaved = parseFloat((totalKWh * 0.7).toFixed(1)); // ~0.7kg CO2 saved per kWh
    const revenue = parseFloat((totalKWh * 0.17).toFixed(2)); // ~$0.17 per kWh tariff value

    const newReport = {
      _id: 'REP-' + Date.now().toString().slice(-6),
      title: periodTitle,
      period: reportPeriod,
      periodRange: dateRange || todayStr,
      generatedDate: todayStr,
      totalEnergyGeneratedKWh: totalKWh,
      avgEfficiencyPct: avgEff,
      activePanelsCount: activePanels.length,
      carbonSavedKg: carbonSaved,
      revenueUsd: revenue
    };

    if (isConnected) {
      const dbReport = new Report(newReport);
      await dbReport.save();
    } else {
      getStore().reports.unshift(newReport);
    }

    res.status(201).json({ success: true, data: newReport });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate report: ' + err.message });
  }
};

module.exports = { getReports, generateReport };
