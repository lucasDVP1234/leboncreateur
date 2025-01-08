// controllers/creatorController.js

const Creator = require('../models/Creator'); // Ensure this import is present
const Createur = require('../models/Createur'); // Ensure this import is present

exports.getCreators = async (req, res) => {
    try {
        const { categories, videoTypes, ageMin, ageMax, countries, langues, atouts, genres } = req.query;

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
        if (langues) {
            query.langue = { $in: langues.split(',') };
        }
        if (atouts) {
            query.atout = { $in: atouts.split(',') };
        }
        if (genres) {
            query.genre = { $in: genres.split(',') };
        }

        // Fetch creators based on query
        const creators = await Creator.find(query);

        // Fetch categories and videoTypes for filters
        const categoriesList = await Creator.distinct('category');
        const videoTypesList = await Creator.distinct('videoTypes');
        const countriesList = await Creator.distinct('country');
        const languesList = await Creator.distinct('langue');
        const atoutsList = await Creator.distinct('atout');
        const genresList = await Creator.distinct('genre');

        res.render('creators', {
            creators,
            categories: categoriesList,
            videoTypes: videoTypesList,
            countries: countriesList,
            langues: languesList,
            atouts: atoutsList,
            genres: genresList,
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

exports.getAddCreator = async (req, res) => {
    try {
        res.render('addCreator');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

  
exports.postAddCreator = async (req, res) => {
try {
    const {
    name,
    age,
    country,
    langue,
    profileImage,
    portfolioImages,
    videoTypes,
    category,
    genre,
    atout,
    videos,
    } = req.body;

    // Create a new Creator instance
    const newCreator = new Creator({
    name,
    age,
    country,
    langue,
    profileImage,
    genre,
    portfolioImages: portfolioImages.split(','), // Assuming comma-separated URLs
    videoTypes: videoTypes.split(','), // Assuming comma-separated types
    category: category.split(','), // Assuming comma-separated types
    atout: atout.split(','), // Assuming comma-separated types
    videos: videos.split(','), // Assuming comma-separated types
    });

    await newCreator.save();

    res.redirect('/creators'); // Redirect to creators list or wherever appropriate
} catch (err) {
    console.error('Error adding creator:', err.message);
    res.status(500).send('Error adding creator.');
}
};

exports.getEditCreator = async (req, res) => {
    try {
        const creators = await Creator.find({}, 'name _id');

        // If a creator ID is provided in the query, fetch that creator
        let creator = null;
        if (req.query.creatorId) {
            creator = await Creator.findById(req.query.creatorId);
        }

        res.render('editCreator', {
            creators,
            creator,
        });
    } catch (error) {
        console.error('Error fetching creator for edit:', error.message);
        res.status(500).send('Server Error');
    }
};

exports.postEditCreator = async (req, res) => {
    try {
        const creatorId = req.body.creatorId;
        const {
            name,
            age,
            country,
            langue,
            profileImage,
            portfolioImages,
            videoTypes,
            category,
            genre,
            atout,
            videos,
        } = req.body;

        const updatedData = {
            name,
            age,
            country,
            langue,
            profileImage,
            genre,
            portfolioImages: portfolioImages.split(',').filter(Boolean),
            videoTypes: videoTypes.split(',').filter(Boolean),
            category: category.split(',').filter(Boolean),
            atout: atout.split(',').filter(Boolean),
            videos: videos.split(',').filter(Boolean),
        };

        await Creator.findByIdAndUpdate(creatorId, updatedData);

        res.redirect('/creators'); // Redirect to creators list or wherever appropriate
    } catch (error) {
        console.error('Error updating creator:', error.message);
        res.status(500).send('Error updating creator.');
    }
};


exports.showProfile = async (req, res) => {
    try {
      const createur = await Createur.findById(req.user._id);
      if (!createur) {
        req.flash('error', 'Créateur introuvable.');
        return res.redirect('/');
      }
      res.render('profile-createur', { createur });
    } catch (err) {
      console.error('Error fetching createur profile:', err);
      req.flash('error', 'Erreur lors de la récupération du profil.');
      res.redirect('/');
    }
  };

  exports.updateProfile = async (req, res) => {
    try {
      let createur = await Createur.findById(req.user._id);
      if (!createur) {
        req.flash('error', 'Créateur introuvable.');
        return res.redirect('/creators');
      }
  
      // 1) Update text fields
      createur.pseudo = req.body.pseudo;
      createur.genre = req.body.genre;
      createur.email = req.body.email;
      createur.number = req.body.number;
      createur.age = req.body.age;
      createur.description = req.body.description;
      createur.country = req.body.country;
      createur.insta = req.body.insta;
      createur.shownum = !!req.body.shownum;
      createur.showemail = !!req.body.showemail;
  
      // Convert comma-separated strings back to arrays if needed
      if (req.body.langue) {
        createur.langue = req.body.langue.split(',').map(l => l.trim());
      }
      if (req.body.atout) {
        createur.atout = req.body.atout.split(',').map(a => a.trim());
      }
  
      // 2) Handle uploads with Multer => req.files
      // Example: uploading to S3 (pseudo-code)
      if (req.files['profileImage']) {
        const profileImageFile = req.files['profileImage'][0];
        const imageUrl = await uploadToS3(profileImageFile);
        createur.profileImage = imageUrl;
      }
  
      if (req.files['portfolioImages']) {
        // If you want to push to an array
        const portfolioUrls = [];
        for (const file of req.files['portfolioImages']) {
          const imageUrl = await uploadToS3(file);
          portfolioUrls.push(imageUrl);
        }
        // Decide if you overwrite or append
        createur.portfolioImages = [
          ...(createur.portfolioImages || []),
          ...portfolioUrls
        ];
      }
  
      if (req.files['marqueLogo']) {
        const logoUrls = [];
        for (const file of req.files['marqueLogo']) {
          const logoUrl = await uploadToS3(file);
          logoUrls.push(logoUrl);
        }
        createur.marqueLogo = [
          ...(createur.marqueLogo || []),
          ...logoUrls
        ];
      }
  
      if (req.files['videos']) {
        const videoUrls = [];
        for (const file of req.files['videos']) {
          const videoUrl = await uploadToS3(file);
          videoUrls.push(videoUrl);
        }
        createur.videos = [
          ...(createur.videos || []),
          ...videoUrls
        ];
      }
  
      // 3) Save
      await createur.save();
  
      req.flash('success', 'Profil mis à jour avec succès !');
      res.redirect('/profile-createur');
    } catch (err) {
      console.error('Error updating createur profile:', err);
      req.flash('error', 'Erreur lors de la mise à jour du profil.');
      res.redirect('/profile-createur');
    }
  };