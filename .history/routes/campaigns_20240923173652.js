// routes/campaigns.js
const express = require('express');
const campaignController = require('../controllers/campaignController');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

// Book Creator Route
//router.post('/book', ensureAuthenticated, campaignController.bookCreator);
router.post('/campaigns/create', ensureAuthenticated, campaignController.createCampaign);

module.exports = router;
