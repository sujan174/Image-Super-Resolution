const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../../public/images/');

async function handleResult(req, res) {
    try {
        const { 
            imageUrl, 
            originalImageUrl, 
            model, 
            scale, 
            originalDimensions, 
            upscaledDimensions 
        } = req.query;

        if (!imageUrl) {
            return res.redirect('/upload');
        }
        
        res.render('result', { 
            imageUrl,
            originalImageUrl,
            model,
            scale,
            originalDimensions,
            upscaledDimensions
        });
    } catch (error) {
        console.error("Error rendering result page:", error);
        res.redirect(`/upload?error=${encodeURIComponent("Could not load the result page.")}`);
    }
}

module.exports = handleResult;
