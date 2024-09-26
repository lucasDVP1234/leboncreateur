// routes/campaigns.js
const express = require('express');
const campaignController = require('../controllers/campaignController');
const { ensureAuthenticated } = require('../middlewares/auth');
const { ensureProfileComplete } = require('../middlewares/auth');
const router = express.Router();

// Book Creator Route
//router.post('/book', ensureAuthenticated, campaignController.bookCreator);
//router.post('/campaigns/create', ensureAuthenticated, campaignController.createCampaign);

router.post('/campaigns/select', ensureAuthenticated, campaignController.postSelectCreators);

router.post('/campaigns/create', ensureProfileComplete, campaignController.postCreateCampaign);
module.exports = router;
