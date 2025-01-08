// routes/auth.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

// Google OAuth Routes
router.get('/auth/google', (req, res, next) => {
    console.log('Initiating Google OAuth');
    console.log('BASE_URL:', process.env.BASE_URL);
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req, res, next) => {
    console.log('Handling Google OAuth Callback');
    console.log('Query Parameters:', req.query);
    next();
}, passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);

// Local Authentication Routes
router.get('/login', (req, res, next) => {
    console.log('GET /login');
    next();
}, authController.getLogin);

// Local Authentication Routes Createur
router.get('/login-createur', (req, res, next) => {
    console.log('GET /login createur');
    next();
}, authController.getLoginCreateur);

router.post('/login-createur', (req, res, next) => {
    console.log('POST /login with body createur:', req.body);
    next();
}, authController.postLoginCreateur);

router.post('/login', (req, res, next) => {
    console.log('POST /login with body:', req.body);
    next();
}, authController.postLogin);

// Logout Route
router.get('/logout', (req, res, next) => {
    console.log('GET /logout');
    next();
}, authController.logout);

// Signup Routes
router.get('/signup', (req, res, next) => {
    console.log('GET /signup');
    next();
}, userController.getSignup);

router.post('/signup', (req, res, next) => {
    console.log('POST /signup with body:', req.body);
    next();
}, userController.postSignup);

// Signup Createur Routes
router.get('/signup-createur', (req, res, next) => {
    console.log('GET /signup-createur');
    next();
}, userController.getSignupCreateur);

router.post('/signup-createur', (req, res, next) => {
    console.log('POST /signup createur with body:', req.body);
    next();
}, userController.postSignupCreateur);

router.get('/forgot', userController.getForgotPassword);
router.post('/forgot', userController.postForgotPassword);

// Reset Password Routes
router.get('/reset/:token', userController.getResetPassword);
router.post('/reset/:token', userController.postResetPassword);

module.exports = router;
