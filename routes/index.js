// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const creatorRoutes = require('./creators');
const campaignRoutes = require('./campaigns');

// Home Route
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/account');
  }
  res.render('signup');
});

// Use other routers
router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', creatorRoutes);
router.use('/', campaignRoutes);

module.exports = router;
