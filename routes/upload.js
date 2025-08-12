const express = require("express");
const multer = require("multer");
const path = require('path');
const fs = require('fs'); 
const handleUpload = require('../controllers/upscale/handleUpload');
const handleResult = require('../controllers/upscale/handleResult');
const handleFeedback = require('../controllers/utils/handleFeedback');

const checkForAuthentication = require('../middleware/checkForAuthentictaion');

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

router.get('/', checkForAuthentication,(req, res) => {
    const { error, success } = req.query;
    res.render("upload", { error, success });
});

router.post('/', checkForAuthentication, upload.single('imageFile'), handleUpload);

router.post('/feedback', checkForAuthentication, handleFeedback);

router.get('/result', handleResult);

module.exports = router;
