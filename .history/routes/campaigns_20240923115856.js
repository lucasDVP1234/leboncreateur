// routes/campaigns.js
const express = require('express');
const Campaign = require('../models/Campaign');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

// Book Creator Route
router.post('/book', ensureAuthenticated, async (req, res) => {
  try {
    const { creatorId, schedule } = req.body;
    const newCampaign = new Campaign({
      userId: req.user._id,
      creatorId,
      schedule,
      status: 'Scheduled',
    });
    await newCampaign.save();
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.send('Error booking.');
  }
});

// Account Page
router.get('/account', ensureAuthenticated, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user._id })
      .populate('creatorId', 'name'); // Populate creator's name

    // Map campaigns to include creator's name directly
    const campaignsWithCreator = campaigns.map(campaign => ({
      creatorName: campaign.creatorId.name,
      schedule: campaign.schedule,
      status: campaign.status,
    }));

    res.render('account', { campaigns: campaignsWithCreator, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching campaigns.');
  }
});

module.exports = router;
