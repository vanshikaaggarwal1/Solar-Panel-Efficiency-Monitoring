const express = require('express');
const router = express.Router();
const { getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance } = require('../controllers/maintenanceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getMaintenance);
router.post('/', verifyToken, createMaintenance);
router.put('/:id', verifyToken, updateMaintenance);
router.delete('/:id', verifyToken, deleteMaintenance);

module.exports = router;
