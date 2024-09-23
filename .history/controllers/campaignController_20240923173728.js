// controllers/campaignController.js
const Campaign = require('../models/Campaign');
const Creator = require('../models/Creator');

// Create Campaign with Selected Creators
exports.createCampaign = async (req, res) => {
  try {
    const { creatorIds } = req.body;

    // Check if at least one creator is selected
    if (!creatorIds || creatorIds.length === 0) {
      return res.send('Please select at least one creator.');
    }

    // Create a new campaign with the selected creators
    const newCampaign = new Campaign({
      userId: req.user._id,
      creatorIds: Array.isArray(creatorIds) ? creatorIds : [creatorIds], // Ensure it's an array
      status: 'Pending',
    });

    await newCampaign.save();
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.send('Error creating campaign.');
  }
};

// ... other controller functions ...
