const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getTelemetry,
  getLatestTelemetry,
  getTelemetryByPanel,
  getTelemetryHistory,
  seedTelemetry
} = require('../controllers/telemetryController');

// Secure all telemetry endpoints using project's existing JWT middleware
router.get('/', verifyToken, getTelemetry);
router.get('/latest', verifyToken, getLatestTelemetry);
router.get('/panel/:panelId', verifyToken, getTelemetryByPanel);
router.get('/history/:panelId', verifyToken, getTelemetryHistory);
router.post('/seed', verifyToken, seedTelemetry);

module.exports = router;
