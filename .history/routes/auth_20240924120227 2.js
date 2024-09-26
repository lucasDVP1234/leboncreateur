// routes/auth.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

// Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);

// Local Authentication Routes
router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

// Logout Route
router.get('/logout', authController.logout);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

module.exports = router;
