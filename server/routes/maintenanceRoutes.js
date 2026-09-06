const express = require('express');
const router = express.Router();
const { getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance } = require('../controllers/maintenanceController');
const { verifyToken, requireRoles } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getMaintenance);
router.post('/', verifyToken, requireRoles('Admin', 'Manager', 'Technician'), createMaintenance);
router.put('/:id', verifyToken, requireRoles('Admin', 'Manager', 'Technician'), updateMaintenance);
router.delete('/:id', verifyToken, requireRoles('Admin', 'Manager'), deleteMaintenance);

module.exports = router;
