const userModel = require('../../models/user');
const feedbackModel = require('../../models/feedback');

async function handleGallery(req, res) {
    try {
        const user = await userModel.findById(req.user.id).lean();
        if (!user) {
            return res.redirect('/user/login');
        }

        const feedback = await feedbackModel.find({ userId: req.user.id }).lean();

        res.render('gallery', {
            user: user,
            images: user.imageHistory.reverse(),
            feedback: feedback,
            error: null
        });

    } catch (error) {
        console.error("Error fetching gallery data:", error);
        res.render('gallery', {
            user: { name: 'Guest' },
            images: [],
            feedback: [],
            error: "Could not load your gallery."
        });
    }
}

module.exports = handleGallery;
