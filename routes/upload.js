// Developed by Sandesh K

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const handleUpload = require('../controllers/upscale/handleUpload');
const handleResult = require('../controllers/upscale/handleResult');
const handleFeedback = require('../controllers/utils/handleFeedback');
const checkForAuthentication = require('../middleware/checkForAuthentictaion');
const userModel = require('../models/user');

const router = express.Router();
const IMAGES_DIR = path.join(__dirname, '../public/images/');

fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Configure multer storage for handling uploaded image files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Display upload page for authenticated users
router.get('/', checkForAuthentication, async (req, res) => {
  try {
    const { error, success } = req.query;
    const user = await userModel.findById(req.user.id).lean();
    res.render('upload', { error, success, user });
  } catch (err) {
    console.error('Error fetching user for upload page:', err);
    res.redirect('/user/login');
  }
});

// Define routes for image upload, feedback submission, and result display
router.post('/', checkForAuthentication, upload.single('imageFile'), handleUpload);
router.post('/feedback', checkForAuthentication, handleFeedback);
router.get('/result', handleResult);

module.exports = router;
