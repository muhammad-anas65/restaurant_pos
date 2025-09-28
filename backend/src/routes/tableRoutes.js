const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable
} = require('../controllers/tableController');

const router = express.Router();

router.get('/', authenticateToken, getTables);
router.get('/:id', authenticateToken, getTable);

// Admin only routes
router.post('/', authenticateToken, authorizeRole(['admin']), createTable);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateTable);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteTable);

module.exports = router;