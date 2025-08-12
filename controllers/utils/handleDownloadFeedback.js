const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const feedbackModel = require('../../models/feedback');

const IMAGES_DIR = path.join(__dirname, '../../public/images/');

async function handleDownloadFeedback(req, res) {
    try {
        const { status } = req.query;
        const likedResult = status === 'liked';
        
        const feedbackItems = await feedbackModel.find({ likedResult: likedResult }).lean();

        if (feedbackItems.length === 0) {
            return res.status(404).send('No images to download for this category.');
        }

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('error', function(err) {
            throw err;
        });

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                console.warn('Archiver warning:', err);
            } else {
                throw err;
            }
        });
        
        res.attachment(`${status}-images.zip`);
        archive.pipe(res);
        feedbackItems.forEach(item => {
            const originalPath = path.join(IMAGES_DIR, item.originalImageFilename);
            const upscaledPath = path.join(IMAGES_DIR, item.upscaledImageFilename);
            
            if (fs.existsSync(originalPath)) {
                archive.file(originalPath, { name: `original/${item.originalImageFilename}` });
            }
            if (fs.existsSync(upscaledPath)) {
                archive.file(upscaledPath, { name: `upscaled/${item.upscaledImageFilename}` });
            }
        });

        await archive.finalize();

    } catch (error) {
        console.error("Error creating zip file:", error);
        if (!res.headersSent) {
            res.status(500).send("Could not create zip file.");
        }
    }
}

module.exports = handleDownloadFeedback;
