const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const perkaraController = require('../controllers/perkaraController');

// Login route
router.post('/login', userController.login);
router.post('/logout', userController.logout);
// router.post('/register', userController.register);
// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);

// perkara routes
router.get('/perkara', perkaraController.getAllPerkara);
router.get('/perkara/:id', perkaraController.getPerkaraById);
router.post('/perkara', perkaraController.createPerkara);
router.put('/perkara/:id', perkaraController.updatePerkara);
router.delete('/perkara/:id', perkaraController.deletePerkara);

// User routes
router.get('/users/', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users/', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
