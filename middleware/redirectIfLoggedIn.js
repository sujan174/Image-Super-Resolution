// Developed by Sujan H

const jwt = require('jsonwebtoken');

// Redirect authenticated users to upload page, preventing access to login/signup
function redirectIfLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect('/upload');
  } catch (error) {
    res.clearCookie('token');
    return next();
  }
}

module.exports = redirectIfLoggedIn;
