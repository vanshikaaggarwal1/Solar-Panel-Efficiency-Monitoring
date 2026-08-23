const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getStore, getIsConnected } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

const { startTelemetrySimulator, generate30DayHistory } = require('./simulator/telemetrySimulator');

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/panels', require('./routes/panelRoutes'));
app.use('/api/sensor-data', require('./routes/sensorRoutes'));
app.use('/api/telemetry', require('./routes/telemetryRoutes'));
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

// Start Background Telemetry Simulator Engine
startTelemetrySimulator();
generate30DayHistory().catch(err => console.error('Initial history seed error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Solar Panel Monitoring Server running on http://localhost:${PORT}`);
});
