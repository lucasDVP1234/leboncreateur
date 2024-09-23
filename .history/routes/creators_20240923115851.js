// routes/creators.js
const express = require('express');
const Creator = require('../models/Creator');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

// Creators Page
router.get('/creators', ensureAuthenticated, async (req, res) => {
  try {
    const creators = await Creator.find({});

    // Extract unique categories and video types
    let categories = [];
    let videoTypes = [];
    creators.forEach(creator => {
      if (!categories.includes(creator.category)) {
        categories.push(creator.category);
      }
      creator.videoTypes.forEach(type => {
        if (!videoTypes.includes(type)) {
          videoTypes.push(type);
        }
      });
    });

    // Render the creators view with the necessary data
    res.render('creators', { creators, categories, videoTypes });
  } catch (err) {
    console.error(err);
    res.send('Error fetching creators.');
  }
});

module.exports = router;
