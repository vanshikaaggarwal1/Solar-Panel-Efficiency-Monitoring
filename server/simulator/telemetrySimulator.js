/**
 * Solar Telemetry Simulator Module for Solarix MERN Application
 * 
 * Simulates realistic solar telemetry readings based on solar irradiance curves,
 * ambient temperature variations, panel tech specifications, and electrical relationships (P = V * I).
 * Supports panel profiles, fault injection, and background interval loop.
 */

const { getStore, getIsConnected } = require('../config/db');
const Telemetry = require('../models/Telemetry');
const SolarPanel = require('../models/SolarPanel');
const SensorData = require('../models/SensorData');
const Alert = require('../models/Alert');

// Panel Profiles with specific hardware characteristics
const DEFAULT_PANEL_PROFILES = [
  { panelId: 'PANEL-001', model: 'SunPower Maxeon 6', ratedCapacityKW: 4.0, baseEfficiency: 22.8, areaM2: 17.6, factor: 1.05 },
  { panelId: 'PANEL-002', model: 'Canadian Solar HiKu', ratedCapacityKW: 3.8, baseEfficiency: 21.0, areaM2: 16.6, factor: 0.98 },
  { panelId: 'PANEL-003', model: 'Jinko Solar Tiger Neo', ratedCapacityKW: 4.5, baseEfficiency: 23.2, areaM2: 19.2, factor: 1.08 },
  { panelId: 'PANEL-004', model: 'Trina Vertex S', ratedCapacityKW: 4.0, baseEfficiency: 21.5, areaM2: 18.0, factor: 1.01 },
  { panelId: 'PANEL-005', model: 'LONGi Hi-MO 5', ratedCapacityKW: 4.1, baseEfficiency: 21.9, areaM2: 18.8, factor: 1.03 },
  // Compatibility mappings for existing seed panels
  { panelId: 'SP-101', model: 'SunPower Maxeon 6 400W', ratedCapacityKW: 4.0, baseEfficiency: 22.8, areaM2: 17.63, factor: 1.04 },
  { panelId: 'SP-102', model: 'SunPower Maxeon 6 400W', ratedCapacityKW: 4.0, baseEfficiency: 22.1, areaM2: 18.1, factor: 1.02 },
  { panelId: 'SP-103', model: 'Canadian Solar HiKu 380W', ratedCapacityKW: 3.8, baseEfficiency: 19.5, areaM2: 16.64, factor: 0.88 },
  { panelId: 'SP-104', model: 'Jinko Solar Tiger Neo 450W', ratedCapacityKW: 4.5, baseEfficiency: 23.5, areaM2: 19.18, factor: 1.09 },
  { panelId: 'SP-105', model: 'Jinko Solar Tiger Neo 450W', ratedCapacityKW: 4.5, baseEfficiency: 23.2, areaM2: 19.34, factor: 1.07 }
];

// Active fault tracking for simulation auto-recovery
const activeFaults = {};

/**
 * Calculates realistic solar telemetry reading for a given panel at a specific date/time
 */
const generateTelemetryPoint = (panelProfile, userId = 'usr-001', plantId = 'PLANT-01', timestampDate = new Date()) => {
  const date = new Date(timestampDate);
  const hour = date.getHours() + date.getMinutes() / 60;

  // 1. Day/Night Solar Irradiance Curve (00:00 to 24:00)
  let baseIrradiance = 0;
  if (hour >= 6 && hour <= 18) {
    // Peak sun position around 12:30 PM
    const sunlightFactor = Math.sin(((hour - 6) / 12) * Math.PI);
    baseIrradiance = 1000 * Math.pow(sunlightFactor, 1.2);
  }

  // Add realistic small cloud variations / atmospheric noise
  const noise = (Math.random() - 0.5) * 40;
  const irradiance = Math.max(0, Math.round(baseIrradiance + (baseIrradiance > 0 ? noise : 0)));

  // 2. Temperature curve: ambient temp + thermal buildup from irradiance
  const ambientTemp = 18 + Math.sin(((hour - 4) / 24) * 2 * Math.PI) * 8; // 10°C at night up to 26°C daytime
  const heatingEffect = (irradiance / 1000) * 22;
  const tempNoise = (Math.random() - 0.5) * 1.5;
  let temperature = parseFloat((ambientTemp + heatingEffect + tempNoise).toFixed(1));

  // 3. Efficiency & Thermal Degradation (-0.4% per °C above 25°C STC)
  const tempLossPct = Math.max(0, (temperature - 25) * 0.004);
  let efficiency = parseFloat((panelProfile.baseEfficiency * (1 - tempLossPct) * panelProfile.factor + (Math.random() - 0.5) * 0.4).toFixed(2));
  efficiency = Math.max(0, Math.min(30, efficiency));

  // 4. Power Output Calculation (kW)
  // Power = Irradiance * Area * Efficiency / 1000
  let power = 0;
  if (irradiance > 0) {
    const rawPowerKW = (irradiance * panelProfile.areaM2 * (efficiency / 100)) / 1000;
    power = parseFloat((rawPowerKW * (0.98 + Math.random() * 0.04)).toFixed(2));
  }

  // 5. Voltage & Current Fluctuations (P = V * I)
  let voltage = 0;
  let current = 0;
  if (irradiance > 10) {
    const baseVoltage = 48.0 + (Math.random() - 0.5) * 2.0;
    voltage = parseFloat(baseVoltage.toFixed(1));
    const powerWatts = power * 1000;
    current = parseFloat((powerWatts / voltage).toFixed(1));
  }

  // 6. Energy Accumulation Estimate (kWh)
  const energy = parseFloat((power * (hour / 24) * 5.2).toFixed(2));

  let status = 'Online';
  let faultDetails = null;

  // 7. Fault Simulation Logic
  const panelId = panelProfile.panelId;
  const faultProbability = parseFloat(process.env.FAULT_PROBABILITY || '0.01');

  // Check existing fault lifecycle or trigger a new uncommon fault
  if (activeFaults[panelId]) {
    activeFaults[panelId].cyclesRemaining -= 1;
    const currentFault = activeFaults[panelId];

    if (currentFault.type === 'panel_offline') {
      status = 'Offline';
      power = 0;
      voltage = 0;
      current = 0;
      efficiency = 0;
      faultDetails = { type: 'Panel Offline', description: 'Communication link down or breaker tripped.' };
    } else if (currentFault.type === 'high_temperature') {
      status = 'Degraded';
      temperature = parseFloat((58 + Math.random() * 8).toFixed(1));
      efficiency = parseFloat((efficiency * 0.65).toFixed(1));
      faultDetails = { type: 'Thermal Hotspot', description: `Excessive heat detected: ${temperature}°C.` };
    } else if (currentFault.type === 'low_efficiency') {
      status = 'Degraded';
      efficiency = parseFloat((11 + Math.random() * 3).toFixed(1));
      power = parseFloat((power * 0.5).toFixed(2));
      faultDetails = { type: 'Low Efficiency', description: 'Photovoltaic cell degradation alert.' };
    } else if (currentFault.type === 'abnormal_voltage') {
      status = 'Fault';
      voltage = parseFloat((22 + Math.random() * 5).toFixed(1));
      faultDetails = { type: 'Abnormal Voltage', description: 'Inverter output voltage out of spec.' };
    }

    if (activeFaults[panelId].cyclesRemaining <= 0) {
      delete activeFaults[panelId]; // Fault resolved
    }
  } else if (Math.random() < faultProbability && hour >= 8 && hour <= 17) {
    // Inject a realistic temporary fault condition
    const faultTypes = ['high_temperature', 'low_efficiency', 'abnormal_voltage', 'panel_offline'];
    const selectedFault = faultTypes[Math.floor(Math.random() * faultTypes.length)];

    activeFaults[panelId] = {
      type: selectedFault,
      cyclesRemaining: Math.floor(Math.random() * 3) + 2 // Lasts 2 to 4 simulation cycles
    };
  }

  return {
    _id: `tlm-${Date.now()}-${panelId}`,
    panelId,
    userId,
    plantId,
    power,
    energy,
    voltage,
    current,
    irradiance,
    temperature,
    efficiency,
    status,
    faultDetails,
    timestamp: date
  };
};

/**
 * Historical Data Generator (30 Days of realistic solar telemetry)
 */
const generate30DayHistory = async (userId = 'usr-001') => {
  const isConnected = getIsConnected();
  const historyData = [];
  const now = new Date();

  console.log('⚡ Generating 30-day historical telemetry dataset...');

  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const dayDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    // Hourly sampling from 06:00 to 20:00
    for (let hour = 6; hour <= 20; hour += 2) {
      dayDate.setHours(hour, 0, 0, 0);

      DEFAULT_PANEL_PROFILES.forEach(profile => {
        const point = generateTelemetryPoint(profile, userId, 'PLANT-01', new Date(dayDate));
        historyData.push(point);
      });
    }
  }

  if (isConnected) {
    try {
      const existingCount = await Telemetry.countDocuments();
      if (existingCount === 0) {
        await Telemetry.insertMany(historyData);
        console.log(`✅ Seeded ${historyData.length} historical telemetry records in MongoDB.`);
      }
    } catch (err) {
      console.error('Error seeding historical telemetry:', err.message);
    }
  } else {
    const store = getStore();
    if (!store.telemetry) store.telemetry = [];
    if (store.telemetry.length === 0) {
      store.telemetry = [...historyData];
      console.log(`✅ Seeded ${historyData.length} historical telemetry records in memory store.`);
    }
  }

  return historyData;
};

let simulatorIntervalId = null;

/**
 * Continuously running backend telemetry simulation engine
 */
const startTelemetrySimulator = (userId = 'usr-001') => {
  if (simulatorIntervalId) {
    clearInterval(simulatorIntervalId);
  }

  const intervalMs = parseInt(process.env.TELEMETRY_INTERVAL || '5000', 10);
  console.log(`🚀 Solar Telemetry Simulator running (Interval: ${intervalMs}ms)`);

  simulatorIntervalId = setInterval(async () => {
    try {
      const isConnected = getIsConnected();
      const currentTickReadings = DEFAULT_PANEL_PROFILES.map(profile => 
        generateTelemetryPoint(profile, userId, 'PLANT-01', new Date())
      );

      if (isConnected) {
        // 1. Bulk insert telemetry records into MongoDB
        await Telemetry.insertMany(currentTickReadings);

        // 2. Sync latest panel state in SolarPanel model
        for (const reading of currentTickReadings) {
          await SolarPanel.findOneAndUpdate(
            { panelId: reading.panelId },
            {
              currentOutputKW: reading.power,
              efficiency: reading.efficiency,
              temperatureC: reading.temperature,
              voltageV: reading.voltage,
              currentA: reading.current,
              irradianceWM2: reading.irradiance,
              status: reading.status === 'Fault' ? 'Degraded' : reading.status
            },
            { upsert: true }
          );

          // 3. Create Alert if fault detected
          if (reading.status === 'Fault' || reading.status === 'Degraded' || reading.temperature > 55) {
            const alertId = `ALT-${Date.now().toString().slice(-6)}`;
            await Alert.create({
              _id: alertId,
              panelId: reading.panelId,
              type: reading.temperature > 55 ? 'Overheating' : 'System Degraded',
              severity: reading.status === 'Fault' ? 'Critical' : 'Warning',
              description: reading.faultDetails?.description || `Telemetry anomaly detected on ${reading.panelId}`,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              status: 'Active'
            });
          }
        }
      } else {
        // Fallback memory store update
        const store = getStore();
        if (!store.telemetry) store.telemetry = [];
        
        currentTickReadings.forEach(reading => {
          store.telemetry.unshift(reading);
          
          // Update solarPanels array in memory
          const existingPanel = store.solarPanels.find(p => p.panelId === reading.panelId);
          if (existingPanel) {
            existingPanel.currentOutputKW = reading.power;
            existingPanel.efficiency = reading.efficiency;
            existingPanel.temperatureC = reading.temperature;
            existingPanel.voltageV = reading.voltage;
            existingPanel.currentA = reading.current;
            existingPanel.irradianceWM2 = reading.irradiance;
            if (reading.status === 'Fault') existingPanel.status = 'Degraded';
          }
        });

        // Limit memory store telemetry size to 500 records
        if (store.telemetry.length > 500) {
          store.telemetry = store.telemetry.slice(0, 500);
        }
      }
    } catch (err) {
      console.error('Telemetry simulator tick error:', err.message);
    }
  }, intervalMs);

  return simulatorIntervalId;
};

const stopTelemetrySimulator = () => {
  if (simulatorIntervalId) {
    clearInterval(simulatorIntervalId);
    simulatorIntervalId = null;
  }
};

module.exports = {
  generateTelemetryPoint,
  generate30DayHistory,
  startTelemetrySimulator,
  stopTelemetrySimulator,
  DEFAULT_PANEL_PROFILES
};