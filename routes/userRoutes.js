const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, onlyAdmin } = require('../middleware/authMiddleware');

// menampilkan semua user
router.get('/users', authenticate, onlyAdmin, userController.getAllUsers);
// ✅ PATCH / PUT user berdasarkan ID
router.put('/users/:id', userController.updateUser);
// ✅ DELETE user berdasarkan ID
router.delete('/users/:id', authenticate, onlyAdmin, userController.deleteUser);

module.exports = router;
