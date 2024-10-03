// routes/creators.js
const express = require('express');
const creatorController = require('../controllers/creatorController');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

// Creators Page
router.get('/creators', ensureAuthenticated, creatorController.getCreators);

router.get('/creators/:id', ensureAuthenticated, creatorController.getCreatorsById);


module.exports = router;
