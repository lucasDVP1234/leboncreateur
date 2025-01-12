// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const creatorRoutes = require('./creators');





// Use other routers
router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', creatorRoutes);


module.exports = router;
