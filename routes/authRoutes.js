// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, onlyAdmin } = require('../middleware/authMiddleware');

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Register (hanya untuk admin)
router.post('/register', authenticate, onlyAdmin, authController.register);

module.exports = router;
