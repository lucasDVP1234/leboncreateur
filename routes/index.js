// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const creatorRoutes = require('./creators');


router.get('/ugc', (req, res) => {
    res.render('ugc', {
      success_messages: req.flash('success'),
      error_messages: req.flash('error'),
    });
  });

router.get('/selection-ugc', (req, res) => {
res.render('selection-ugc', {
    success_messages: req.flash('success'),
    error_messages: req.flash('error')
});
});

router.get('/platforme-ugc', (req, res) => {
    res.render('platformes-ugc', {
      success_messages: req.flash('success'),
      error_messages: req.flash('error')
    });
  });
  
// Use other routers
router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', creatorRoutes);


module.exports = router;
