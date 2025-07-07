const express = require('express');
const router = express.Router();
const perkaraController = require('../controllers/perkaraController');

// POST /api/perkara
router.post('/perkara', perkaraController.createPerkara);

module.exports = router;
