const userModel = require('../../models/user');

async function handleGallery(req, res) {
    try {
        const user = await userModel.findById(req.user.id).lean();

        if (!user) {
            return res.redirect('/user/login');
        }

        res.render('gallery', {
            user: user,
            images: user.imageHistory ? user.imageHistory.reverse() : [],
            error: null
        });

    } catch (error) {
        console.error("Error fetching gallery data:", error);
        res.render('gallery', {
            user: { name: 'Guest' },
            images: [],
            error: "Could not load your gallery."
        });
    }
}

module.exports = handleGallery;
