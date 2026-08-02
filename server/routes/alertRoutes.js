const express = require('express');
const router = express.Router();
const { getAlerts, updateAlertStatus, createAlert } = require('../controllers/alertController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAlerts);
router.post('/', verifyToken, createAlert);
router.put('/:id/status', verifyToken, updateAlertStatus);

module.exports = router;
