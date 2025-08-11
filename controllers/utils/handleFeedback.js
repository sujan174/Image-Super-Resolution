const feedbackModel = require('../../models/feedback');

async function handleFeedback(req, res) {
    try {
        const {
            originalImageFilename,
            upscaledImageFilename,
            modelUsed,
            scaleFactor,
            likedResult,
            originalQuery
        } = req.body;

        if (!req.user || !req.user.id) {
            return res.redirect(`/upload?error=${encodeURIComponent("Authentication error.")}`);
        }

        await feedbackModel.create({
            userId: req.user.id,
            originalImageFilename,
            upscaledImageFilename,
            modelUsed,
            scaleFactor,
            likedResult: likedResult === 'yes'
        });

        const feedbackStatus = likedResult === 'yes' ? 'thankyou' : 'showReupscale';
        
        const redirectUrl = `/upload/result?${originalQuery}&feedback=${feedbackStatus}`;

        return res.redirect(redirectUrl);

    } catch (error) {
        console.error("Error handling feedback:", error);
        return res.redirect(`/upload?error=${encodeURIComponent("Could not save your feedback.")}`);
    }
}

module.exports = handleFeedback;
