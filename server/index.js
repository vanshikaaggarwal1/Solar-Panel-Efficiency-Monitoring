const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getStore, getIsConnected } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/panels', require('./routes/panelRoutes'));
app.use('/api/sensor-data', require('./routes/sensorRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Solar Panel Efficiency Monitoring System',
    timestamp: new Date().toISOString(),
    databaseConnected: getIsConnected()
  });
});

// Telemetry Simulation Background Loop (fluctuates power, temp, voltage slightly)
setInterval(() => {
  if (!getIsConnected()) {
    const store = getStore();
    store.solarPanels.forEach(panel => {
      if (panel.status === 'Active') {
        const deltaKW = (Math.random() * 0.1 - 0.05);
        panel.currentOutputKW = Math.max(0, parseFloat((panel.currentOutputKW + deltaKW).toFixed(2)));
        panel.temperatureC = parseFloat((35 + Math.random() * 8).toFixed(1));
        panel.voltageV = parseFloat((47.5 + Math.random() * 1.5).toFixed(1));
        panel.currentA = parseFloat((78 + Math.random() * 4).toFixed(1));
        panel.irradianceWM2 = Math.round(920 + Math.random() * 80);
      }
    });
  }
}, 5000);

app.listen(PORT, () => {
  console.log(`🚀 Solar Panel Monitoring Server running on http://localhost:${PORT}`);
});
