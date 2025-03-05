// controllers/creatorController.js

//const Creator = require('../models/Creator'); // Ensure this import is present
const Createur = require('../models/Createur'); // Ensure this import is present

exports.getCreators = async (req, res) => {
    try {
        const { categories, videoTypes, ageMin, ageMax, countries, langues, atouts, genres, searchName } = req.query;

        // Build query object
        let query = {
          isCardActive: true
        };

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
        if (searchName) {
          query.pseudo = { $regex: searchName, $options: 'i' };
        }

        // Fetch creators based on query
        const createurs = await Createur.find(query);

        // Fetch categories and videoTypes for filters
        const categoriesList = await Createur.distinct('category');
        const videoTypesList = await Createur.distinct('videoTypes');
        const countriesList = await Createur.distinct('country');
        const languesList = await Createur.distinct('langue');
        const atoutsList = await Createur.distinct('atout');
        const genresList = await Createur.distinct('genre');

        res.render('creators', {
          createurs,
          user: req.user || null,
            categories: categoriesList,
            videoTypes: videoTypesList,
            countries: countriesList,
            langues: languesList,
            atouts: atoutsList,
            genres: genresList,
            searchName
        });
    } catch (err) {
        console.error('Error fetching creators:', err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCreatorByPseudo = async (req, res) => {
  try {
    const { pseudo } = req.params;
    const createur = await Createur.findOne({ pseudo });

    if (!createur) {
      return res.status(404).send('Créateur introuvable');
    }

    // Render the same 'creator' page you used for getCreatorsById
    res.render('creator', { createur,user: req.user || null  });
  } catch (error) {
    console.error('Error fetching creator by pseudo:', error);
    res.status(500).send('Server Error');
  }
};



exports.showProfile = async (req, res) => {
    try {
      const createur = await Createur.findById(req.user._id);
      if (!createur) {
        req.flash('error', 'Créateur introuvable.');
        return res.redirect('/');
      }
      res.render('profile-createur', { createur, user: req.user || null });
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
      createur.videoPrice = req.body.videoPrice;
  
      // 2) Convert multi-checkbox fields (langue, atout)
      const langueData = req.body.langue;
      let langueArray = [];
      if (Array.isArray(langueData)) {
        langueArray = langueData;
      } else if (typeof langueData === 'string') {
        langueArray = [langueData];
      }
      createur.langue = langueArray;
  
      const atoutData = req.body.atout;
      let atoutArray = [];
      if (Array.isArray(atoutData)) {
        atoutArray = atoutData;
      } else if (typeof atoutData === 'string') {
        atoutArray = [atoutData];
      }
      createur.atout = atoutArray;
  
      // 3) Remove selected videos
      // (req.body.removeVideos could be an array of video URLs to remove)
      const removeVideos = req.body.removeVideos; 
      // If user didn’t check any remove box, removeVideos could be undefined
      if (removeVideos) {
        // Ensure it's an array
        const removeArray = Array.isArray(removeVideos) ? removeVideos : [removeVideos];
        createur.videos = createur.videos.filter(videoUrl => !removeArray.includes(videoUrl));
      }
      const removeLogos = req.body.removeLogos;
      if (removeLogos) {
        const removeArray = Array.isArray(removeLogos) ? removeLogos : [removeLogos];
        if (createur.marqueLogo && createur.marqueLogo.length > 0) {
          createur.marqueLogo = createur.marqueLogo.filter(
            logoUrl => !removeArray.includes(logoUrl)
          );
        }
      }
  
      // 4) Handle file uploads
      // "profileImage", "portfolioImages", "marqueLogo", "videos" from multer
      if (req.files['profileImage']) {
        const profileImageFile = req.files['profileImage'][0];
        createur.profileImage = profileImageFile.location;
      }
  
      if (req.files['portfolioImages'] && req.files['portfolioImages'][0]) {
        const portfolioFile = req.files['portfolioImages'][0];
        createur.portfolioImages = [portfolioFile.location];
      }
  
      // Marque Logo
      if (req.files['marqueLogo']) {
        if (!createur.marqueLogo) createur.marqueLogo = [];
        req.files['marqueLogo'].forEach(file => {
          createur.marqueLogo.push(file.location);
        });
      }
  
      // New videos
      if (req.files['videos']) {
        if (!createur.videos) createur.videos = [];
        req.files['videos'].forEach(file => {
          createur.videos.push(file.location);
        });
      }
  
      // 5) Save
      await createur.save();

      // 6) Check profile completeness and activate card if valid
    const requiredFields = [
      { value: createur.pseudo,          type: 'string' },
      { value: createur.email,           type: 'string' },
      { value: createur.number,          type: 'string' },
      { value: createur.age,             type: 'number' },
      { value: createur.description,     type: 'string' },
      { value: createur.atout,           type: 'array' },
      { value: createur.country,         type: 'string' },
      { value: createur.profileImage,    type: 'string' },
      
    ];

    const isProfileComplete = requiredFields.every(fieldObj => {
      const { value, type } = fieldObj;
      if (!value) return false;
      switch (type) {
        case 'string':
          return value.trim().length > 0;
        case 'number':
          return value > 0;
        case 'array':
          return Array.isArray(value) && value.length > 0;
        default:
          return false;
      }
    });

    if (isProfileComplete) {
      createur.isCardActive = true;
      await createur.save();
      req.flash('success', 'Profil mis à jour et carte activée avec succès !');
    } else {
      req.flash('success', 'Profil mis à jour avec succès !');
    }
      res.redirect('/account-createur');
  
    } catch (err) {
      console.error('Error updating createur profile:', err);
      req.flash('error', 'Erreur lors de la mise à jour du profil.');
      res.redirect('/account-createur');
    }
  };
  // controllers/creatorController.js
exports.activateCard = async (req, res) => {
  try {
    const createur = await Createur.findById(req.user._id);
    if (!createur) {
      req.flash('error', 'Créateur introuvable.');
      return res.redirect('/profile-createur');
    }

    // 1) Check if profile is complete
    const requiredFields = [
      { value: createur.pseudo,         type: 'string' },
      { value: createur.email,          type: 'string' },
      { value: createur.number,         type: 'string' },
      { value: createur.age,            type: 'number' },
      { value: createur.description,    type: 'string' },
      { value: createur.atout,          type: 'array' },   // expecting array
      { value: createur.country,        type: 'string' },
      { value: createur.profileImage,   type: 'string' },  // or could be 'stringOrNull'
        // expecting array
         // expecting array
    ];
    
    const isProfileComplete = requiredFields.every(fieldObj => {
      const { value, type } = fieldObj;
    
      // 1) If the field is truly required but empty or missing, fail immediately.
      if (!value) return false;
    
      // 2) Handle different types
      switch (type) {
        case 'string':
          // Must have at least 1 non-whitespace character
          return value.trim().length > 0;
        case 'number':
          // e.g., age > 0
          return value > 0;
        case 'array':
          // Must have at least 1 item
          return Array.isArray(value) && value.length > 0;
        default:
          return false;
      }
    });

    // 2) If not complete, redirect them to /profile-createur
    if (!isProfileComplete) {
      req.flash(
        'error',
        'Impossible d’activer la carte : veuillez compléter tous les champs requis.'
      );
      return res.redirect('/profile-createur');
    }

    // 3) If complete, activate the card
    createur.isCardActive = true;
    await createur.save();

    req.flash('success', 'Votre carte est maintenant active !');
    res.redirect('/account-createur'); // Or wherever you want to go after activation
  } catch (error) {
    console.error('Error activating card:', error);
    req.flash('error', 'Erreur lors de l’activation de la carte.');
    res.redirect('/profile-createur');
  }
};

exports.deactivateCard = async (req, res) => {
  try {
    const createur = await Createur.findById(req.user._id);
    if (!createur) {
      req.flash('error', 'Créateur introuvable.');
      return res.redirect('/profile-createur');
    }

    // Simply set isCardActive to false
    createur.isCardActive = false;
    await createur.save();

    req.flash('success', 'Votre carte est maintenant désactivée.');
    res.redirect('/account-createur');
  } catch (error) {
    console.error('Error deactivating card:', error);
    req.flash('error', 'Erreur lors de la désactivation de la carte.');
    res.redirect('/profile-createur');
  }
};

