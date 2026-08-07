const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalyticsData } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, getDashboardStats);
router.get('/analytics', verifyToken, getAnalyticsData);

module.exports = router;
