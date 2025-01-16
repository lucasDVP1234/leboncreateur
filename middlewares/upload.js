require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3-v3');
const { S3Client } = require('@aws-sdk/client-s3');

// 1) Configure AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'eu-west-3'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 2) Initialize upload middleware with S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read', // or another ACL setting you want
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // Use user ID or createur ID to name files uniquely
      // If you're using 'req.user', ensure user is authenticated
      // If user can be either user or createur, adapt the ID logic accordingly
      const userId = req.user ? req.user._id : 'anonymous';
      
      const fileExtension = file.originalname.split('.').pop();
      const timestamp = Date.now();
      const filename = `${userId}-${timestamp}.${fileExtension}`;

      // Determine folder based on fieldname
      let folder = '';
      switch (file.fieldname) {
        case 'profileImage':
          folder = 'profile_images/';
          break;
        case 'portfolioImages':
          folder = 'portfolio_images/';
          break;
        case 'marqueLogo':
          folder = 'marque_logos/';
          break;
        case 'videos':
          folder = 'videos/';
          break;
        default:
          folder = 'misc/';
      }
      
      // Pass final key => folder + filename
      cb(null, folder + filename);
    },
  }),

  // 3) File Filter to ensure correct file types per field
  fileFilter: function (req, file, cb) {
    // Check by fieldname
    if (file.fieldname === 'profileImage' || file.fieldname === 'portfolioImages' || file.fieldname === 'marqueLogo') {
      // Must be an image
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Veuillez télécharger un fichier image pour ' + file.fieldname));
      }
    } else if (file.fieldname === 'videos') {
      // Must be a video
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Veuillez télécharger un fichier vidéo pour ' + file.fieldname));
      }
    } else {
      // If there's a field we didn't account for, either allow or reject
      // Here we reject for safety:
      cb(new Error(`Le champ ${file.fieldname} n'est pas géré.`));
    }
  },

  // 4) File size limits
  limits: { fileSize: 150 * 1024 * 1024 }, // e.g. 10MB limit for each file
});

module.exports = upload;
