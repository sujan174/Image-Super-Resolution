const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const userModel = require('../../models/user');

const IMAGES_DIR = path.join(__dirname, '../../public/images/');

async function handleDownloadFeedback(req, res) {
    try {
        const { status } = req.query;
        const likedResult = status === 'liked';

        const users = await userModel.find({ 'imageHistory.likedResult': likedResult }).lean();

        const imagesToZip = users.flatMap(user =>
            user.imageHistory.filter(item => item.likedResult === likedResult)
        );

        if (imagesToZip.length === 0) {
            return res.status(404).send('No images to download for this category.');
        }

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('error', (err) => {
            throw err;
        });

        res.attachment(`${status}-images.zip`);
        archive.pipe(res);

        imagesToZip.forEach(item => {
            const originalPath = path.join(IMAGES_DIR, item.originalPath);
            const upscaledPath = path.join(IMAGES_DIR, item.upscaledPath);

            if (fs.existsSync(originalPath)) {
                archive.file(originalPath, { name: `original/${item.originalPath}` });
            }
            if (fs.existsSync(upscaledPath)) {
                archive.file(upscaledPath, { name: `upscaled/${item.upscaledPath}` });
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
