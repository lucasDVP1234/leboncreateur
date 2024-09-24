// middlewares/auth.js

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function ensureProfileComplete(req, res, next) {
  const user = req.user;
  if (user && user.name && user.job) {
    return next();
  } else {
    alert("Creer une campagne d'abord")
    res.redirect('/campaigns');
  }
}


module.exports = { ensureAuthenticated, ensureProfileComplete };
