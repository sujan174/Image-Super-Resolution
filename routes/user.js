const express = require("express");
const router = express.Router();

const handleLogin = require("../controllers/authentication/login");
const handleSignup = require("../controllers/authentication/signup");
const handleLogout = require("../controllers/authentication/logout");
const { handleAdminDashboard, handleGetAllUsers, handleGetUserDetail } = require("../controllers/authentication/admin");
const redirectIfLoggedIn = require("../middleware/redirectIfLoggedIn");
const checkForAuthentication = require('../middleware/checkForAuthentictaion');

router.get('/signup', redirectIfLoggedIn, (req, res) => res.render("signup"));
router.get('/login', redirectIfLoggedIn, (req, res) => res.render("login"));
router.get('/logout', handleLogout);

router.post('/login', handleLogin);
router.post('/signup', handleSignup);

router.get('/admin', checkForAuthentication, handleAdminDashboard);
router.get('/admin/users', checkForAuthentication, handleGetAllUsers);
router.get('/admin/users/:id', checkForAuthentication, handleGetUserDetail);

module.exports = router;
