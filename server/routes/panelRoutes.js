const express = require('express');
const router = express.Router();
const { getPanels, getPanelById, createPanel, updatePanel, deletePanel } = require('../controllers/panelController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getPanels);
router.get('/:id', verifyToken, getPanelById);
router.post('/', verifyToken, createPanel);
router.put('/:id', verifyToken, updatePanel);
router.delete('/:id', verifyToken, deletePanel);

module.exports = router;
