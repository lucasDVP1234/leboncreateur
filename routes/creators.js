// routes/creators.js
const express = require('express');
const creatorController = require('../controllers/creatorController');
const { ensureAuthenticated, ensureCreateur } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const handleFileUpload = require('../middlewares/handleFileUpload');
const router = express.Router();

// Creators Page


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

router.get('/:pseudo', creatorController.getCreatorByPseudo);
// POST route for activating the card
router.post('/activate-card', ensureAuthenticated, ensureCreateur, creatorController.activateCard);
// Deactivate card
router.post('/deactivate-card', ensureAuthenticated, ensureCreateur, creatorController.deactivateCard);






module.exports = router;
