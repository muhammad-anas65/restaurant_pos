const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  processPayment
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrder);
router.post('/', authenticateToken, validateRequest(schemas.order), createOrder);
router.put('/:id', authenticateToken, updateOrder);
router.post('/:id/payment', authenticateToken, validateRequest(schemas.payment), processPayment);

module.exports = router;