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
mongoose.connect('mongodb+srv://lucas:2406@plateforme.nilrv.mongodb.net/', {
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
app.get('/creators', async (req, res) => {
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




app.post('/book', (req, res) => {
    console.log(req.body)
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
