const express = require("express");
const router = express.Router();

const handleLogin = require("../controllers/authentication/login");
const handleSignup = require("../controllers/authentication/signup");
const handleLogout = require("../controllers/authentication/logout");
const { handleAdminDashboard, handleGetAllUsers, handleGetUserDetail, handleAdminFeedbackView } = require("../controllers/authentication/admin");
const redirectIfLoggedIn = require("../middleware/redirectIfLoggedIn");
const checkForAdmin = require('../middleware/checkForAdmin');
const checkForAuthentication = require('../middleware/checkForAuthentictaion');
const handleGallery = require("../controllers/utils/gallery");
const handleDownloadFeedback = require("../controllers/utils/handleDownloadFeedback")

router.get('/signup', redirectIfLoggedIn, (req, res) => res.render("signup"));
router.get('/login', redirectIfLoggedIn, (req, res) => res.render("login"));
router.get('/logout', handleLogout);

router.post('/login', handleLogin);
router.post('/signup', handleSignup);

router.get('/gallery', checkForAuthentication, handleGallery);

router.get('/admin', checkForAuthentication, checkForAdmin, handleAdminDashboard);
router.get('/admin/users', checkForAuthentication, checkForAdmin, handleGetAllUsers);
router.get('/admin/users/:id', checkForAuthentication, checkForAdmin, handleGetUserDetail);
router.get('/admin/feedback', checkForAuthentication, checkForAdmin, handleAdminFeedbackView);
router.get('/admin/download-feedback', checkForAuthentication, checkForAdmin, handleDownloadFeedback);

module.exports = router;
