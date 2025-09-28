const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
} = require('../controllers/menuController');

const router = express.Router();

// Public routes (for cashiers)
router.get('/', authenticateToken, getMenuItems);
router.get('/categories', authenticateToken, getCategories);
router.get('/:id', authenticateToken, getMenuItem);

// Admin only routes
router.post('/', authenticateToken, authorizeRole(['admin']), validateRequest(schemas.menuItem), createMenuItem);
router.put('/:id', authenticateToken, authorizeRole(['admin']), validateRequest(schemas.menuItem), updateMenuItem);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteMenuItem);

module.exports = router;