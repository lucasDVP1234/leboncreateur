// controllers/creatorController.js

const Creator = require('../models/Creator'); // Ensure this import is present

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
        const countriesList = await Creator.distinct('country');

        res.render('creators', {
            creators,
            categories: categoriesList,
            videoTypes: videoTypesList,
            countries: countriesList,
        });
    } catch (err) {
        console.error('Error fetching creators:', err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCreatorsById = async (req, res) => {
    try {
        const creatorId = req.params.id;
        const creator = await Creator.findById(creatorId);

        if (!creator) {
            return res.status(404).send('Creator not found');
        }

        res.render('creator', { creator });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};