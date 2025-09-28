const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { login, getProfile } = require('../controllers/authController');

const router = express.Router();

router.post('/login', validateRequest(schemas.login), login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;