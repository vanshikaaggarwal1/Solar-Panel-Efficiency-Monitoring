const express = require('express');
const router = express.Router();
const { getReports, generateReport } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getReports);
router.post('/generate', verifyToken, generateReport);

module.exports = router;
