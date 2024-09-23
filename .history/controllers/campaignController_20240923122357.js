// controllers/campaignController.js
const Campaign = require('../models/Campaign');

// Book a Creator
exports.bookCreator = async (req, res) => {
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
};
