const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { getDailySales, getMonthlySales } = require('../controllers/reportController');

const router = express.Router();

// Admin only routes
router.get('/daily', authenticateToken, authorizeRole(['admin']), getDailySales);
router.get('/monthly', authenticateToken, authorizeRole(['admin']), getMonthlySales);

module.exports = router;