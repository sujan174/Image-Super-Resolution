const express = require("express");
const multer = require("multer");
const path = require('path');
const fs = require('fs'); 
const handleUpload = require('../controllers/upscale/handleUpload');
const handleResult = require('../controllers/upscale/handleResult');
const handleFeedback = require('../controllers/utils/handleFeedback');
const checkForAuthentication = require('../middleware/checkForAuthentictaion');
const userModel = require("../models/user")

const router = express.Router();

const IMAGES_DIR = path.join(__dirname, '../public/images/');
fs.mkdirSync(IMAGES_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', checkForAuthentication, async (req, res) => {
    try {
        const { error, success } = req.query;
        const user = await userModel.findById(req.user.id).lean();
        res.render("upload", { error, success, user: user });
    } catch (err) {
        console.error("Error fetching user for upload page:", err);
        res.redirect('/user/login');
    }
});

router.post('/', checkForAuthentication, upload.single('imageFile'), handleUpload);
router.post('/feedback', checkForAuthentication, handleFeedback);
router.get('/result', handleResult);

module.exports = router;
