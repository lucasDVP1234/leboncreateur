// controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Campaign = require('../models/Campaign'); // Import Campaign
const Creator = require('../models/Creator'); // Import Creator if needed


// Render Signup Page
exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/account');
  }
  res.render('signup');
};

// Handle Signup
exports.postSignup = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const companyName = req.body.companyName;
    const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;

    // Check if passwords match
    //if (password !== confirmPassword) {
      //req.flash('error', 'Les mots de passe sont différents.');
      //return res.redirect('/signup');
    //}
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Check if the email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash('error', 'Un compte avec cet e-mail existe déjà. Veuillez vous connecter ou utiliser un autre e-mail.');
      return res.redirect('/signup');
    }

    const newUser = new User({
      email: email,
      companyName: companyName,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    // req.session.userId = savedUser._id.toString();

    // Authenticate the user after successful signup
    req.logIn(savedUser, function (err) {
      if (err) {
        req.flash('error', 'Une erreur est survenue lors de la connexion.');
        return res.redirect('/');
      }
      return res.redirect('/creators');
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    req.flash('error', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    res.redirect('/signup');
  }
};

// Set Password
exports.setPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.send('Passwords do not match.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password in the database
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    console.log('Password updated for user:', req.user._id);

    
    req.flash('success', 'Votre mot de passe a bien été changé !');
    
    res.redirect('/account');
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    req.flash('error', 'Une erreur est survenue lors de votre changement de mot de passe. Veuillez réessayer.');
    res.redirect('/account');
    
  }
};

// Render Account Page
exports.getAccount = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user.name || !user.job) {
      // Redirect to the campaign details form if user info is incomplete
        return res.redirect('/creators');
      }
      // Find all campaigns for the logged-in user and populate the creator names
      const campaigns = await Campaign.find({ userId: req.user._id })
        .populate('creatorIds', 'name profileImage'); // Populate creators' names
  
      
  
      // Map campaigns to include the creators' names and count of creators
      const campaignsWithCreators = campaigns.map((campaign) => {
        let creators = [];
        if (Array.isArray(campaign.creatorIds)) {
          // campaign.creatorIds is an array
          creators = campaign.creatorIds.map((creator) => ({
            name : creator.name, 
            photo : creator.profileImage
          }));

        } else if (campaign.creatorIds) {
          // campaign.creatorIds is a single object
          creators = [{
            name: campaign.creatorIds.name,
            photo: campaign.creatorIds.profileImage,
          }];
        } else {
          // campaign.creatorIds is undefined or null
          creators = [];
        }
  
        const creatorCount = creators.length;
  
        return {
          creators,
          creatorCount,
          budget: campaign.budget,
          date: campaign.date ? campaign.date.toDateString() : 'N/A',
          status: campaign.status,
        };
      });
      
  
      // Render the account page with the campaigns and the user info
      res.render('account', { campaigns: campaignsWithCreators, user: req.user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching campaigns.');
    }
  };
