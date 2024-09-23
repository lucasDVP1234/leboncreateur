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
    clientID: '903623938914-o6t92kjd9us2pf14v1b0bbuokmp0aihh.apps.googleusercontent.com',
    clientSecret: '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',
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

Routes
app.get('/', (req, res) => {
    res.render('signup');
});

app.post("/signup", function(req, res){
    const newUser = new User({
        email: req.body,
        password: req.body
    });

    newUser.save().then(()=>{
        res.render("signup");
    }).catch((err)=>{
        console.log(err);
    })
});

// app.post('/signup', (req, res) => {
//     const { email, companyName } = req.body;
//     const newUser = new User({ email, companyName });
//     newUser.save((err) => {
//         if (err) return res.send('Error signing up.');
//         res.redirect('/creators');
//     });
// });

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
app.get('/creators', (req, res) => {
    Creator.find({}, (err, creators) => {
        if (err) {
            console.error(err);
            res.send('Error fetching creators.');
            return;
        }

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
        res.render('creators', { creators, categories, videoTypes });
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
