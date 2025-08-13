const express = require("express");
const router = express.Router();
const passport = require('../middleware/passport-setup');
const jwt = require("jsonwebtoken")

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

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/user/login', session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } 
        );
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).redirect("/upload");
    }
);

module.exports = router;
