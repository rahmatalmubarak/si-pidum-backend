const express = require('express');
const router = express.Router();
const perkaraController = require('../controllers/perkaraController');
const { authenticate, onlyAdmin } = require('../middleware/authMiddleware');

// menampilkan semua perkara
router.get('/perkara', authenticate, perkaraController.getAllPerkara);

// Menampilkan perkara berdasarkan ID
router.get('/perkara/:id', authenticate, perkaraController.getPerkaraById);

// Sinkronisasi perkara dari CMS
router.post('/perkara/sync', perkaraController.syncPerkaraFromCMS);

// Mengubah perkara berdasarkan ID
router.put('/perkara/:id', authenticate, perkaraController.updatePerkara);

module.exports = router;
