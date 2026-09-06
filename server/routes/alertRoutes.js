const express = require('express');
const router = express.Router();
const { getAlerts, updateAlertStatus, createAlert } = require('../controllers/alertController');
const { verifyToken, requireRoles } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAlerts);
router.post('/', verifyToken, requireRoles('Admin', 'Manager', 'Operator', 'Technician'), createAlert);
router.put('/:id/status', verifyToken, requireRoles('Admin', 'Manager', 'Operator', 'Technician'), updateAlertStatus);

module.exports = router;
