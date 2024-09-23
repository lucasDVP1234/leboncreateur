// routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

// Signup Routes
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
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

    // Authenticate the user after successful signup
    req.login(savedUser, function(err) {
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
});

// Set Password Route
router.post('/set-password', ensureAuthenticated, async (req, res) => {
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
});

module.exports = router;
