const { getStore, getIsConnected } = require('../config/db');
const SolarPanel = require('../models/SolarPanel');
const SensorData = require('../models/SensorData');

const getDashboardStats = async (req, res) => {
  try {
    const isConnected = getIsConnected();
    let panels = [];
    let sensors = [];

    if (isConnected) {
      panels = await SolarPanel.find();
      sensors = await SensorData.find().sort({ createdAt: -1 }).limit(8);
    } else {
      panels = getStore().solarPanels;
      sensors = getStore().sensorData.slice(0, 8);
    }

    const totalPanels = panels.length;
    const activePanels = panels.filter(p => p.status === 'Active').length;
    const offlinePanels = panels.filter(p => p.status === 'Offline').length;
    const maintenancePanels = panels.filter(p => p.status === 'Maintenance').length;
    const degradedPanels = panels.filter(p => p.status === 'Degraded').length;

    // Total live metrics aggregated across active panels
    const currentPowerKW = parseFloat(panels.reduce((sum, p) => sum + p.currentOutputKW, 0).toFixed(2));
    const avgEfficiency = parseFloat((panels.reduce((sum, p) => sum + p.efficiency, 0) / (totalPanels || 1)).toFixed(1));
    const avgTemperature = parseFloat((panels.reduce((sum, p) => sum + p.temperatureC, 0) / (totalPanels || 1)).toFixed(1));
    const avgVoltage = parseFloat((panels.reduce((sum, p) => sum + p.voltageV, 0) / (totalPanels || 1)).toFixed(1));
    const totalCurrentA = parseFloat(panels.reduce((sum, p) => sum + p.currentA, 0).toFixed(1));
    const avgIrradiance = parseFloat((panels.reduce((sum, p) => sum + p.irradianceWM2, 0) / (totalPanels || 1)).toFixed(0));
    const avgBatteryPct = parseFloat((panels.reduce((sum, p) => sum + p.batteryStatusPct, 0) / (totalPanels || 1)).toFixed(0));

    // Energy metrics
    const energyTodayKWh = parseFloat((currentPowerKW * 6.2).toFixed(1)); // ~6.2 sun hours equivalent
    const monthlyEnergyKWh = parseFloat((energyTodayKWh * 30).toFixed(1));
    const carbonSavedKg = parseFloat((monthlyEnergyKWh * 0.7).toFixed(1));
    const revenueEstimateUsd = parseFloat((monthlyEnergyKWh * 0.17).toFixed(2));

    // Chart Datasets
    const hourlyLabels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const lineChartEnergy = [4.2, 18.5, 32.8, 42.1, 39.4, 27.2, 11.5, 1.8];
    const lineChartIrradiance = [120, 420, 780, 1020, 950, 640, 260, 30];

    const barChartDailyOutput = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { label: 'Rooftop Array', data: [180, 195, 210, 205, 220, 215, 230] },
        { label: 'Ground Array', data: [240, 255, 270, 260, 280, 275, 290] },
        { label: 'Carport Array', data: [110, 115, 120, 95, 125, 120, 130] }
      ]
    };

    const pieChartUtilization = {
      labels: ['Direct Load / Self-Use', 'Battery Storage Charge', 'Grid Export Surplus', 'Conversion Loss'],
      data: [52, 28, 15, 5]
    };

    res.json({
      success: true,
      stats: {
        totalPanels,
        activePanels,
        offlinePanels,
        maintenancePanels,
        degradedPanels,
        currentPowerKW,
        energyTodayKWh,
        avgEfficiency,
        avgTemperature,
        avgVoltage,
        totalCurrentA,
        avgIrradiance,
        avgBatteryPct,
        monthlyEnergyKWh,
        carbonSavedKg,
        revenueEstimateUsd
      },
      charts: {
        hourlyLabels,
        lineChartEnergy,
        lineChartIrradiance,
        barChartDailyOutput,
        pieChartUtilization
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats: ' + err.message });
  }
};

module.exports = { getDashboardStats };
