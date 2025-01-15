// middlewares/handleFileUpload.js
const upload = require('../middlewares/upload'); // your Multer config

function handleFileUpload(fields, errorRedirectPath) {
  return function (req, res, next) {
    const uploader = upload.fields(fields);

    uploader(req, res, (err) => {
      if (err) {
        // 1) Check if file is too large
        if (err.code === 'LIMIT_FILE_SIZE') {
          // Distinguish by field if needed:
          // If you used "profileImage", "portfolioImages", etc. in the fields array, 
          // you can see if `req.files.profileImage` or others exist.

          if (req.files && req.files.profileImage) {
            req.flash('error', 'Photo trop large. Max 5MB pour les images.');
          } else if (req.files && req.files.videos) {
            req.flash('error', 'Vidéo trop volumineuse. Max 100MB pour les vidéos.');
          } else {
            // fallback, not sure which field caused it
            req.flash('error', 'Fichier trop volumineux.');
          }
          return res.redirect('/profile-createur');
        }

        // 2) Otherwise, some other error
        console.error('File upload error:', err);
        req.flash('error', err.message || 'Une erreur est survenue lors du téléchargement.');
        return res.redirect('/profile-createur');
      }

      // No error, proceed to controller
      next();
    });
  };
}

module.exports = handleFileUpload;
