// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth Routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/creators');
  }
);

// Local Authentication Routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.send(`Login failed: ${info.message}`);
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      return res.redirect('/account');
    });
  })(req, res, next);
});

// Logout Route
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
