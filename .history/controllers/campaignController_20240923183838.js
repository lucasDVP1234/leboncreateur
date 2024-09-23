const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const Creator = require('../models/Creator');

// Create Campaign with Selected Creators
exports.createCampaign = async (req, res) => {
  try {
    let { creatorIds } = req.body;

    // Check if at least one creator is selected
    if (!creatorIds || creatorIds.length === 0) {
      return res.send('Please select at least one creator.');
    }

    // Ensure creatorIds is an array
    if (!Array.isArray(creatorIds)) {
      creatorIds = [creatorIds]; // If a single creator is selected, make it an array
    }

    // Convert each creatorId (string) to ObjectId only if valid
    const creatorObjectIds = creatorIds.map((id) => {
      // Ensure each id is a valid ObjectId
      if (mongoose.isValidObjectId(id)) {
        return new mongoose.Types.ObjectId(id);
      } else {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
    });

    // Create a new campaign with the selected creators
    const newCampaign = new Campaign({
      userId: req.user._id,
      creatorIds: creatorObjectIds, // Use the array of ObjectIds
      status: 'Pending',
    });

    await newCampaign.save();
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.send(`Error creating campaign: ${err.message}`);
  }
};
