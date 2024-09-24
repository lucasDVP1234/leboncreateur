// middlewares/auth.js

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function ensureProfileComplete(req, res, next) {
  const user = req.session.user;
  if (user && user.name && user.job) {
    return next();
  } else {
    res.redirect('/campaigns/select');
  }
}


module.exports = { ensureAuthenticated, ensureProfileComplete };
