// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/User');
const Creator = require('./models/Creator');
const Campaign = require('./models/Campaign');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/advertising_agency', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback',
},
    (accessToken, refreshToken, profile, done) => {
        User.findOrCreate({ googleId: profile.id }, {
            email: profile.emails[0].value,
            companyName: profile.displayName,
        }, (err, user) => {
            return done(err, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Routes
app.get('/', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { email, companyName } = req.body;
    const newUser = new User({ email, companyName });
    newUser.save((err) => {
        if (err) return res.send('Error signing up.');
        res.redirect('/creators');
    });
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/creators');
    }
);

app.get('/creators', (req, res) => {
    Creator.find({}, (err, creators) => {
        res.render('creators', { creators });
    });
});

app.post('/book', (req, res) => {
    const { creatorId, schedule } = req.body;
    const newCampaign = new Campaign({
        userId: req.user._id,
        creatorId,
        schedule,
        status: 'Scheduled',
    });
    newCampaign.save((err) => {
        if (err) return res.send('Error booking.');
        res.redirect('/account');
    });
});

app.get('/account', (req, res) => {
    Campaign.find({ userId: req.user._id }, (err, campaigns) => {
        res.render('account', { campaigns });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
