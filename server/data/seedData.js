const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('admin123', salt);

const users = [
  {
    _id: 'usr-001',
    name: 'Alex Vance',
    email: 'admin@solar.com',
    password: defaultPasswordHash,
    role: 'Administrator',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco Solar Tech Hub',
    joinedDate: '2024-01-15',
    notificationsEnabled: true
  },
  {
    _id: 'usr-002',
    name: 'Elena Rostova',
    email: 'elena@solar.com',
    password: defaultPasswordHash,
    role: 'Solar Maintenance Engineer',
    phone: '+1 (555) 987-6543',
    location: 'Oakland Solar Farm 4',
    joinedDate: '2024-03-20',
    notificationsEnabled: true
  }
];

const solarPanels = [
  {
    _id: 'SP-101',
    panelId: 'SP-101',
    model: 'SunPower Maxeon 6 400W',
    type: 'Monocrystalline Silicon',
    status: 'Active',
    installationDate: '2023-05-12',
    location: 'Rooftop Sector Alpha (Bay 1)',
    ratedCapacityKW: 4.0,
    panelAreaM2: 17.63,
    currentOutputKW: 3.82,
    efficiency: 22.8,
    temperatureC: 38.5,
    voltageV: 48.2,
    currentA: 79.2,
    irradianceWM2: 950,
    batteryStatusPct: 94,
    lastMaintenanceDate: '2026-06-10',
    tiltAngleDeg: 28,
    azimuthDeg: 180
  },
  {
    _id: 'SP-102',
    panelId: 'SP-102',
    model: 'SunPower Maxeon 6 400W',
    type: 'Monocrystalline Silicon',
    status: 'Active',
    installationDate: '2023-05-12',
    location: 'Rooftop Sector Alpha (Bay 2)',
    ratedCapacityKW: 4.0,
    panelAreaM2: 18.1,
    currentOutputKW: 3.76,
    efficiency: 22.1,
    temperatureC: 41.2,
    voltageV: 47.9,
    currentA: 78.5,
    irradianceWM2: 940,
    batteryStatusPct: 94,
    lastMaintenanceDate: '2026-06-10',
    tiltAngleDeg: 28,
    azimuthDeg: 180
  },
  {
    _id: 'SP-103',
    panelId: 'SP-103',
    model: 'Canadian Solar HiKu 380W',
    type: 'Polycrystalline Silicon',
    status: 'Degraded',
    installationDate: '2022-11-04',
    location: 'Carport East Canopy',
    ratedCapacityKW: 3.8,
    panelAreaM2: 16.64,
    currentOutputKW: 2.15,
    efficiency: 14.2,
    temperatureC: 56.4,
    voltageV: 39.1,
    currentA: 55.0,
    irradianceWM2: 910,
    batteryStatusPct: 82,
    lastMaintenanceDate: '2025-10-18',
    tiltAngleDeg: 15,
    azimuthDeg: 165
  },
  {
    _id: 'SP-104',
    panelId: 'SP-104',
    model: 'Jinko Solar Tiger Neo 450W',
    type: 'N-Type Bifacial',
    status: 'Active',
    installationDate: '2024-01-20',
    location: 'Ground Array West Field 1',
    ratedCapacityKW: 4.5,
    panelAreaM2: 19.18,
    currentOutputKW: 4.41,
    efficiency: 23.5,
    temperatureC: 35.8,
    voltageV: 52.4,
    currentA: 84.1,
    irradianceWM2: 980,
    batteryStatusPct: 98,
    lastMaintenanceDate: '2026-07-01',
    tiltAngleDeg: 32,
    azimuthDeg: 180
  },
  {
    _id: 'SP-105',
    panelId: 'SP-105',
    model: 'Jinko Solar Tiger Neo 450W',
    type: 'N-Type Bifacial',
    status: 'Active',
    installationDate: '2024-01-20',
    location: 'Ground Array West Field 2',
    ratedCapacityKW: 4.5,
    panelAreaM2: 19.34,
    currentOutputKW: 4.38,
    efficiency: 23.2,
    temperatureC: 36.5,
    voltageV: 52.1,
    currentA: 84.0,
    irradianceWM2: 975,
    batteryStatusPct: 98,
    lastMaintenanceDate: '2026-07-01',
    tiltAngleDeg: 32,
    azimuthDeg: 180
  },
  {
    _id: 'SP-106',
    panelId: 'SP-106',
    model: 'Trina Vertex S 400W',
    type: 'Monocrystalline Silicon',
    status: 'Maintenance',
    installationDate: '2023-08-15',
    location: 'South Wing Annex',
    ratedCapacityKW: 4.0,
    panelAreaM2: 18.0,
    currentOutputKW: 0.00,
    efficiency: 0.0,
    temperatureC: 24.1,
    voltageV: 0.0,
    currentA: 0.0,
    irradianceWM2: 930,
    batteryStatusPct: 60,
    lastMaintenanceDate: '2026-07-28',
    tiltAngleDeg: 25,
    azimuthDeg: 175
  },
  {
    _id: 'SP-107',
    panelId: 'SP-107',
    model: 'First Solar Thin Film 350W',
    type: 'CdTe Thin Film',
    status: 'Offline',
    installationDate: '2022-04-10',
    location: 'North Perimeter Array',
    ratedCapacityKW: 3.5,
    panelAreaM2: 18.0,
    currentOutputKW: 0.00,
    efficiency: 0.0,
    temperatureC: 22.0,
    voltageV: 0.0,
    currentA: 0.0,
    irradianceWM2: 920,
    batteryStatusPct: 45,
    lastMaintenanceDate: '2025-04-10',
    tiltAngleDeg: 30,
    azimuthDeg: 190
  },
  {
    _id: 'SP-108',
    panelId: 'SP-108',
    model: 'LONGi Hi-MO 5 410W',
    type: 'Monocrystalline PERC',
    status: 'Active',
    installationDate: '2023-09-01',
    location: 'Rooftop Sector Beta',
    ratedCapacityKW: 4.1,
    panelAreaM2: 18.78,
    currentOutputKW: 3.95,
    efficiency: 21.9,
    temperatureC: 39.0,
    voltageV: 49.0,
    currentA: 80.6,
    irradianceWM2: 960,
    batteryStatusPct: 92,
    lastMaintenanceDate: '2026-05-14',
    tiltAngleDeg: 28,
    azimuthDeg: 180
  }
];

const generateSensorHistory = () => {
  const history = [];
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const baseIrradiance = [120, 420, 780, 1020, 950, 640, 260, 30];
  const baseTemps = [22, 28, 36, 44, 43, 38, 31, 25];

  solarPanels.forEach(panel => {
    hours.forEach((time, idx) => {
      const factor = panel.status === 'Offline' ? 0 : panel.status === 'Maintenance' ? 0 : panel.status === 'Degraded' ? 0.55 : 1.0;
      const v = factor > 0 ? parseFloat((45 + Math.random() * 5).toFixed(1)) : 0;
      const a = factor > 0 ? parseFloat((70 + Math.random() * 15).toFixed(1)) : 0;
      const irr = baseIrradiance[idx];
      const area = panel.panelAreaM2 || 16.64;
      const powerW = v * a;
      const powerKW = parseFloat((powerW / 1000).toFixed(2));
      const solarInputW = irr * area;
      const effPct = (solarInputW > 0 && powerW > 0) ? parseFloat(((powerW / solarInputW) * 100).toFixed(1)) : 0;

      history.push({
        _id: `sns-${panel.panelId}-${idx}`,
        panelId: panel.panelId,
        timestamp: `${time}`,
        date: '2026-08-02',
        powerOutputKW: powerKW,
        voltageV: v,
        currentA: a,
        temperatureC: parseFloat((baseTemps[idx] + (panel.status === 'Degraded' ? 12 : 0)).toFixed(1)),
        irradianceWM2: irr,
        efficiencyPct: effPct
      });
    });
  });
  return history;
};

const sensorData = generateSensorHistory();

const maintenanceRecords = [
  {
    _id: 'MNT-1001',
    panelId: 'SP-106',
    issue: 'Inverter Communication Fault & Connector Corrosion',
    assignedEngineer: 'Elena Rostova',
    status: 'In Progress',
    scheduledDate: '2026-08-01',
    completedDate: null,
    priority: 'High',
    notes: 'Replacing DC isolator unit and re-calibrating telemetry gateway.'
  },
  {
    _id: 'MNT-1002',
    panelId: 'SP-103',
    issue: 'Thermal Hotspot & Reduced Photovoltaic Cell Efficiency',
    assignedEngineer: 'Marcus Brody',
    status: 'Scheduled',
    scheduledDate: '2026-08-04',
    completedDate: null,
    priority: 'Medium',
    notes: 'Thermal imaging scan required to inspect bypass diodes.'
  },
  {
    _id: 'MNT-1003',
    panelId: 'SP-107',
    issue: 'Main Ground Cable Disconnection',
    assignedEngineer: 'Elena Rostova',
    status: 'Scheduled',
    scheduledDate: '2026-08-05',
    completedDate: null,
    priority: 'Critical',
    notes: 'System offline due to safety trip.'
  },
  {
    _id: 'MNT-1000',
    panelId: 'SP-101',
    issue: 'Routine Semi-Annual Cleaning & Dust Removal',
    assignedEngineer: 'Sarah Jenkins',
    status: 'Completed',
    scheduledDate: '2026-06-10',
    completedDate: '2026-06-10',
    priority: 'Low',
    notes: 'Coating inspected, clean hydrophobic glass surface verified.'
  }
];

const alerts = [
  {
    _id: 'ALT-501',
    panelId: 'SP-103',
    type: 'Overheating',
    severity: 'Warning',
    description: 'Cell temperature exceeded 55°C limit (Recorded 56.4°C). Hotspot suspected.',
    timestamp: '2026-08-02 13:45:10',
    status: 'Active'
  },
  {
    _id: 'ALT-502',
    panelId: 'SP-103',
    type: 'Low Efficiency',
    severity: 'Warning',
    description: 'Output efficiency dropped to 14.2% (Benchmark target: >20.0%).',
    timestamp: '2026-08-02 12:30:00',
    status: 'Active'
  },
  {
    _id: 'ALT-503',
    panelId: 'SP-106',
    type: 'Sensor Failure',
    severity: 'Critical',
    description: 'Loss of heartbeat signal from Inverter Gateway SP-106.',
    timestamp: '2026-08-02 09:15:22',
    status: 'Active'
  },
  {
    _id: 'ALT-504',
    panelId: 'SP-107',
    type: 'Low Voltage',
    severity: 'Critical',
    description: 'Terminal voltage dropped to 0.0V. Circuit breaker tripped.',
    timestamp: '2026-08-01 18:20:00',
    status: 'Acknowledged'
  },
  {
    _id: 'ALT-505',
    panelId: 'SP-104',
    type: 'Maintenance Due',
    severity: 'Info',
    description: 'Scheduled preventive checkup due in 14 days.',
    timestamp: '2026-07-30 08:00:00',
    status: 'Resolved'
  }
];

const reports = [
  {
    _id: 'REP-2026-07',
    title: 'Monthly Solar Yield & System Performance Report',
    period: 'Month',
    periodRange: 'July 2026',
    generatedDate: '2026-08-01',
    totalEnergyGeneratedKWh: 8450.2,
    avgEfficiencyPct: 21.6,
    activePanelsCount: 6,
    carbonSavedKg: 5915.1,
    revenueUsd: 1436.53
  },
  {
    _id: 'REP-2026-W30',
    title: 'Weekly Performance & Degradation Audit',
    period: 'Week',
    periodRange: 'Week 30 (Jul 21 - Jul 27)',
    generatedDate: '2026-07-28',
    totalEnergyGeneratedKWh: 1980.4,
    avgEfficiencyPct: 21.8,
    activePanelsCount: 7,
    carbonSavedKg: 1386.2,
    revenueUsd: 336.66
  }
];

module.exports = {
  users,
  solarPanels,
  sensorData,
  maintenanceRecords,
  alerts,
  reports
};
