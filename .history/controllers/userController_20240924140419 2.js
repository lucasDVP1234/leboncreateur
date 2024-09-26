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

    // Check if the email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.send('An account with this email already exists. Please log in or use a different email.');
    }

    const newUser = new User({
      email: email,
      companyName: companyName,
    });

    const savedUser = await newUser.save();
    // req.session.userId = savedUser._id.toString();

    // Authenticate the user after successful signup
    req.logIn(savedUser, function (err) {
      if (err) {
        console.error(err);
        return res.redirect('/');
      }
      return res.redirect('/creators');
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.send('An error occurred during signup. Please try again.');
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

    res.send('Password set successfully. You can now log in with your email and password.');
  } catch (err) {
    console.error('Error setting password:', err);
    res.send('Error setting password.');
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
        .populate('creatorIds', 'name'); // Populate creators' names
  
      // Debugging: Log each campaign's creatorIds to inspect their structure
      campaigns.forEach((campaign) => {
        console.log('campaign.creatorIds:', campaign.creatorIds);
      });
  
      // Map campaigns to include the creators' names and count of creators
      const campaignsWithCreators = campaigns.map((campaign) => {
        let creators = [];
        if (Array.isArray(campaign.creatorIds)) {
          // campaign.creatorIds is an array
          creators = campaign.creatorIds.map((creator) => creator.name);
        } else if (campaign.creatorIds) {
          // campaign.creatorIds is a single object
          creators = [campaign.creatorIds.name];
        } else {
          // campaign.creatorIds is undefined or null
          creators = [];
        }
  
        const creatorCount = creators.length;
  
        return {
          creators: creators.join(', '),
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
