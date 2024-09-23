// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/User');
const Creator = require('./models/Creator');
const Campaign = require('./models/Campaign');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb+srv://lucas:2406@plateforme.nilrv.mongodb.net/');


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
    clientID: '903623938914-o6t92kjd9us2pf14v1b0bbuokmp0aihh.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    companyName: profile.displayName,
                });
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        email = email.toLowerCase().trim();
        console.log('Authenticating user:', email);

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('User not found');
            return done(null, false, { message: 'Incorrect email.' });
        }

        // Check if the user has a password set
        if (!user.password) {
            console.log('No password set for this user.');
            return done(null, false, { message: 'No password set for this user.' });
        }

        // Compare the password
        console.log('Comparing passwords:', password, user.password);
        const match = await bcrypt.compare(password, user.password);
        console.log('Password match result:', match);
        if (match) {
            return done(null, user);
        } else {
            console.log('Incorrect password.');
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (err) {
        console.error('Error during authentication:', err);
        return done(err);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}



// Routes
app.get('/', (req, res) => {
    res.render('signup');
});

// app.js
app.post("/signup", async (req, res) => {
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
            companyName: companyName
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
        if (err.code === 11000 && err.keyValue.email) {
            // Duplicate key error for email
            return res.send('An account with this email already exists. Please log in or use a different email.');
        }
        console.error('Error during signup:', err);
        res.send('An error occurred during signup. Please try again.');
    }
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



// app.js (add or modify the /creators route)
app.get('/creators', ensureAuthenticated, async (req, res) => {
    try {
        const creators = await Creator.find({});
        
        // Extract unique categories and video types
        let categories = [];
        let videoTypes = [];
        creators.forEach(creator => {
            if (!categories.includes(creator.category)) {
                categories.push(creator.category);
            }
            creator.videoTypes.forEach(type => {
                if (!videoTypes.includes(type)) {
                    videoTypes.push(type);
                }
            });
        });
        
        // Render the creators view with the necessary data
        res.render('creators', { creators, categories, videoTypes });
    } catch (err) {
        console.error(err);
        res.send('Error fetching creators.');
    }
});




app.post('/book', ensureAuthenticated, async (req, res) => {
    try {
        const { creatorId, schedule } = req.body;
        const newCampaign = new Campaign({
            userId: req.user._id,
            creatorId,
            schedule,
            status: 'Scheduled',
        });
        await newCampaign.save();
        res.redirect('/account');
    } catch (err) {
        console.error(err);
        res.send('Error booking.');
    }
});


app.get('/account', ensureAuthenticated, async (req, res) => {
    try {
        const campaigns = await Campaign.find({ userId: req.user._id });
        res.render('account', { campaigns, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching campaigns.');
    }
});

// Route to display the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Route to handle login form submission
app.post('/login', (req, res, next) => {
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


app.post('/set-password', ensureAuthenticated, async (req, res) => {
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

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        res.redirect('/'); // Redirect to the home or login page after logout
    });
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
