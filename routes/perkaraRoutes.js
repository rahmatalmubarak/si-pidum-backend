const express = require('express');
const router = express.Router();
const perkaraController = require('../controllers/perkaraController');
const { authenticate, onlyAdmin } = require('../middleware/authMiddleware');

// Membuat perkara baru
router.post('/perkara', authenticate, perkaraController.createPerkara);

// menampilkan semua perkara
router.get('/perkara', authenticate, perkaraController.getAllPerkara);

// GET: /api/perkara/:id
router.get('/perkara/:id', authenticate, perkaraController.getPerkaraById);

module.exports = router;
