const express = require('express');
const router = express.Router();
const { getSensorHistory, addTelemetryTick } = require('../controllers/sensorController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/history', verifyToken, getSensorHistory);
router.post('/tick', verifyToken, addTelemetryTick);

module.exports = router;
