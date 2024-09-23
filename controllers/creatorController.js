// controllers/creatorController.js
const Creator = require('../models/Creator');

// Render Creators Page
exports.getCreators = async (req, res) => {
  try {
    const creators = await Creator.find({});

    // Extract unique categories and video types
    let categories = [];
    let videoTypes = [];
    creators.forEach((creator) => {
      if (!categories.includes(creator.category)) {
        categories.push(creator.category);
      }
      creator.videoTypes.forEach((type) => {
        if (!videoTypes.includes(type)) {
          videoTypes.push(type);
        }
      });
    });

    res.render('creators', { creators, categories, videoTypes });
  } catch (err) {
    console.error(err);
    res.send('Error fetching creators.');
  }
};
