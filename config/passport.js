// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Import both models
const User = require('../models/User');
const Createur = require('../models/Createur');

module.exports = function(passport) {
  console.log('Starting Passport');

  /**
   * --------------------------------------
   * LOCAL STRATEGY FOR "USER"
   * --------------------------------------
   */
  passport.use(
    'local-user',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          email = email.toLowerCase().trim();
          console.log('[Local-User] Authenticating user:', email);

          // Find the user by email in the "User" collection
          const user = await User.findOne({ email: email });
          if (!user) {
            console.log('[Local-User] User not found.');
            return done(null, false, { message: 'Incorrect email.' });
          }

          // Check if the user has a password set
          if (!user.password) {
            console.log('[Local-User] No password set for this user.');
            return done(null, false, { message: 'No password set for this user.' });
          }

          // Compare the password
          const match = await bcrypt.compare(password, user.password);
          console.log('[Local-User] Password match result:', match);
          if (match) {
            return done(null, user);
          } else {
            console.log('[Local-User] Incorrect password.');
            return done(null, false, { message: 'Incorrect password.' });
          }
        } catch (err) {
          console.error('[Local-User] Error during authentication:', err);
          return done(err);
        }
      }
    )
  );

  /**
   * --------------------------------------
   * LOCAL STRATEGY FOR "CREATEUR"
   * --------------------------------------
   */
  passport.use(
    'local-createur',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          email = email.toLowerCase().trim();
          console.log('[Local-Createur] Authenticating createur:', email);

          // Find the createur by email in the "Createur" collection
          const createur = await Createur.findOne({ email: email });
          if (!createur) {
            console.log('[Local-Createur] Createur not found.');
            return done(null, false, { message: 'Incorrect email.' });
          }

          // Check if the createur has a password set
          if (!createur.password) {
            console.log('[Local-Createur] No password set for this createur.');
            return done(null, false, { message: 'No password set for this user.' });
          }

          // Compare the password
          const match = await bcrypt.compare(password, createur.password);
          console.log('[Local-Createur] Password match result:', match);
          if (match) {
            return done(null, createur);
          } else {
            console.log('[Local-Createur] Incorrect password.');
            return done(null, false, { message: 'Incorrect password.' });
          }
        } catch (err) {
          console.error('[Local-Createur] Error during authentication:', err);
          return done(err);
        }
      }
    )
  );

  /**
   * --------------------------------------
   * SERIALIZE / DESERIALIZE
   * --------------------------------------
   */
  passport.serializeUser((loggedInEntity, done) => {
    // We can store both the id and a "type" field in the session
    if (loggedInEntity._doc) {
      // If it's a Mongoose document, you can do:
      const { _id } = loggedInEntity._doc;
      // For clarity, let's store a type field
      const type = loggedInEntity._doc.pseudo ? 'createur' : 'user';
      done(null, { id: _id.toString(), type });
    } else {
      // Fallback
      done(null, { id: loggedInEntity.id, type: 'user' });
    }
  });

  passport.deserializeUser(async (obj, done) => {
    try {
      if (obj.type === 'createur') {
        // Look in Createur collection
        const createur = await Createur.findById(obj.id);
        if (createur) {
          // attach a custom property to `req.user`
          createur.type = 'createur';
          return done(null, createur);
        }
        return done(null, false);
      } else {
        // Look in User collection
        const user = await User.findById(obj.id);
        if (user) {
          // attach a custom property to `req.user`
          user.type = 'user';
          return done(null, user);
        }
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  });
};
