// routes/creators.js
const express = require('express');
const creatorController = require('../controllers/creatorController');
const { ensureAuthenticated } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const handleFileUpload = require('../middlewares/handleFileUpload');
const router = express.Router();

// Creators Page


// Route to display the form to add a new creator (GET request)
router.get('/add', isAdmin, creatorController.getAddCreator);

// Route to handle form submission and add the new creator to the database (POST request)
router.post('/add', isAdmin, creatorController.postAddCreator);

router.get('/creators/edit', creatorController.getEditCreator);

router.post('/creators/edit', creatorController.postEditCreator);

router.get('/creators', creatorController.getCreators);
router.get('/', creatorController.getCreators);

router.get('/profile-createur', ensureAuthenticated, creatorController.showProfile);
router.post(
    '/profile-createur',
    ensureAuthenticated,
    // Use Multer for multiple fields
    handleFileUpload([
      { name: 'profileImage', maxCount: 1 },
      { name: 'portfolioImages', maxCount: 10 },
      { name: 'marqueLogo', maxCount: 10 },
      { name: 'videos', maxCount: 10 }
    ]),
    creatorController.updateProfile
  );

router.get('/creators/:id', creatorController.getCreatorsById);





module.exports = router;
