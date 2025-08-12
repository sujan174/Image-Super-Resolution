const userModel = require('../models/user');

async function checkForAdmin(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            const errorMsg = "You must be logged in to access this page.";
            return res.redirect(`/user/login?error=${encodeURIComponent(errorMsg)}`);
        }

        const user = await userModel.findById(req.user.id).lean();

        if (user && user.admin) {
            return next();
        } else {
            const errorMsg = "You are not authorized to view this page.";
            return res.redirect(`/upload?error=${encodeURIComponent(errorMsg)}`);
        }
    } catch (error) {
        console.error("Admin check failed:", error);
        const errorMsg = "An error occurred. Please try again.";
        return res.redirect(`/upload?error=${encodeURIComponent(errorMsg)}`);
    }
}

module.exports = checkForAdmin;
