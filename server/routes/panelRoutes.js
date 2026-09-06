const express = require('express');
const router = express.Router();
const { getPanels, getPanelById, createPanel, updatePanel, deletePanel } = require('../controllers/panelController');
const { verifyToken, requireRoles } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getPanels);
router.get('/:id', verifyToken, getPanelById);
router.post('/', verifyToken, requireRoles('Admin', 'Manager'), createPanel);
router.put('/:id', verifyToken, requireRoles('Admin', 'Manager'), updatePanel);
router.delete('/:id', verifyToken, requireRoles('Admin', 'Manager'), deletePanel);

module.exports = router;
