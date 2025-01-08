// routes/users.js
const express = require('express');
const userController = require('../controllers/userController');
const { ensureAuthenticated, ensureProfileComplete,ensureCreateur,ensureMarque } = require('../middlewares/auth');
const router = express.Router();


// Set Password Route
router.post('/set-password', ensureAuthenticated,ensureMarque, userController.setPassword);

// Account Page
router.get('/account', ensureAuthenticated,ensureMarque, userController.getAccount);
router.get('/account-createur', ensureAuthenticated,ensureCreateur, userController.getAccountCreateur);

module.exports = router;
