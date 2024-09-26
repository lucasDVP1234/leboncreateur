// middlewares/auth.js

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

exports.ensureProfileComplete = (req, res, next) => {
  const user = req.session.user;
  if (user && user.name && user.job) {
    next();
  } else {
    res.redirect('/campaigns/details');
  }
};

module.exports = { ensureAuthenticated, ensureProfileComplete };
