const express = require("express");
const router = express.Router();

const handleLogin = require("../controllers/authentication/login");
const handleSignup = require("../controllers/authentication/signup");
const redirectIfLoggedIn = require("../middleware/redirectIfLoggedIn");
const handleLogout = require("../controllers/authentication/logout");

router.get('/signup', redirectIfLoggedIn, (req, res) => {
    res.render("signup");
});

router.get('/login', redirectIfLoggedIn, (req, res) => {
    res.render("login");
});

router.post('/login', handleLogin);
router.post('/signup', handleSignup);
router.get('/logout', handleLogout);

module.exports = router;
