const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const Creator = require('../models/Creator');

exports.postSelectCreators = async (req, res) => {
  const { creatorIds } = req.body;

  // Ensure creatorIds is an array
  const selectedCreators = Array.isArray(creatorIds) ? creatorIds : [creatorIds];

  // Store selected creators in session or pass them to the next view
  req.session.selectedCreators = selectedCreators;

  res.render('campaignDetails', { selectedCreators });
};

exports.postCreateCampaign = async (req, res) => {
  try {
    const { name, job, budget, campaignDate } = req.body;
    const creatorIds = req.session.selectedCreators;
    const userId = req.session.user._id;

    // Update user with name and job
    await User.findByIdAndUpdate(userId, { name, job });

    // Create new campaign with budget and date
    const newCampaign = new Campaign({
      userId,
      creatorIds,
      budget,
      date: campaignDate,
      status: 'Pending',
    });

    await newCampaign.save();

    // Clear selected creators from session
    req.session.selectedCreators = null;

    res.redirect('/account');
  } catch (err) {
    console.error('Error creating campaign:', err.message);
    res.send('Error creating campaign.');
  }
};

// Create Campaign with Selected Creators
\
