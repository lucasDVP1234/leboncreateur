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
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
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

app.post("/signup", function(req, res){
    const newUser = new User({
        email: req.body.email,
        companyName: req.body.companyName
    });

    newUser.save().then((savedUser)=>{
        // Authenticate the user after successful signup
        req.login(savedUser, function(err) {
            if (err) {
                console.log(err);
                return res.redirect('/');
            }
            return res.redirect('/creators');
        });
    }).catch((err)=>{
        console.log(err);
        res.redirect('/');
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

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        // Check if the user has a password set
        if (!user.password) {
            return done(null, false, { message: 'No password set for this user.' });
        }

        // Compare the password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (err) {
        return done(err);
    }
}));

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
app.post('/login', async (req, res, next) => {
    
    passport.authenticate('local', {
        successRedirect: '/account',
        failureRedirect: '/login',
        failureFlash: false // Set to true if you use flash messages
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

        res.send('Password set successfully. You can now log in with your email and password.');
    } catch (err) {
        console.error(err);
        res.send('Error setting password.');
    }
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
