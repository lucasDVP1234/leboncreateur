// routes/users.js
const express = require('express');
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middlewares/auth');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Signup Routes
router.get('/signup', userController.getSignup);

router.post('/signup', userController.postSignup);

// Set Password Route
router.post('/set-password', ensureAuthenticated, userController.setPassword);

// Account Page
router.get('/account', ensureAuthenticated, authMiddleware.ensureProfileComplete, userController.getAccount);

module.exports = router;
