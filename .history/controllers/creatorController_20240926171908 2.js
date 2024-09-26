// controllers/creatorController.js

exports.getCreators = async (req, res) => {
  try {
      const { categories, videoTypes, ageMin, ageMax, countries } = req.query;

      // Build query object
      let query = {};

      if (categories) {
          query.category = { $in: categories.split(',') };
      }

      if (videoTypes) {
          query.videoTypes = { $in: videoTypes.split(',') };
      }

      if (ageMin || ageMax) {
          query.age = {};
          if (ageMin) query.age.$gte = parseInt(ageMin);
          if (ageMax) query.age.$lte = parseInt(ageMax);
      }

      if (countries) {
          query.country = { $in: countries.split(',') };
      }

      // Fetch creators based on query
      const creators = await Creator.find(query);

      // Fetch categories and videoTypes for filters
      const categoriesList = await Creator.distinct('category');
      const videoTypesList = await Creator.distinct('videoTypes');

      res.render('creators', {
          creators,
          categories: categoriesList,
          videoTypes: videoTypesList,
      });
  } catch (err) {
      console.error('Error fetching creators:', err.message);
      res.status(500).send('Server Error');
  }
};
