// middlewares/handleFileUpload.js
const upload = require('../middlewares/upload'); // your Multer config

function handleFileUpload(fields, errorRedirectPath) {
  return function (req, res, next) {
    const uploader = upload.fields(fields);

    uploader(req, res, (err) => {
      if (err) {
        // Check if file is too large
        if (err.code === 'LIMIT_FILE_SIZE') {
          req.flash('error', 'Photo trop large. MAX 2MB.');
          return res.redirect(errorRedirectPath);
        }

        // Otherwise, some other error
        console.error('File upload error:', err);
        req.flash('error', 'Une erreur est survenue lors du téléchargement.');
        return res.redirect(errorRedirectPath);
      }

      // No error, proceed to controller
      next();
    });
  };
}

module.exports = handleFileUpload;
