// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const passport = require('passport');
const path = require('path');
const routes = require('./routes');
//const connection = mongoose.createConnection(process.env.MONGODB_URI) 

require('dotenv').config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);


// Middleware
app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

const sessionStore = MongoStore.create({
  client: mongoose.connection.getClient(),
  dbName: 'Plateforme'
})

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === 'production', // true if using HTTPS
    httpOnly: true,
    sameSite : none,
  },
}));

// Passport Configuration
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', routes);

// app.js
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  

//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app
