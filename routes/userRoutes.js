const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, onlyAdmin } = require('../middleware/authMiddleware');

router.get('/users', authenticate, userController.getAllUsers);

module.exports = router;
