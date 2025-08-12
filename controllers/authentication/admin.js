const userModel = require('../../models/user');
const feedbackModel = require('../../models/feedback');

async function handleAdminDashboard(req, res) {
    try {
        const feedback = await feedbackModel.find({});
        
        const likedCount = feedback.filter(f => f.likedResult).length;
        const dislikedCount = feedback.length - likedCount;

        res.render('admin-dashboard', {
            totalUsers: await userModel.countDocuments(),
            totalFeedback: feedback.length,
            likedCount,
            dislikedCount,
            error: null
        });

    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.render('admin-dashboard', {
            totalUsers: 0,
            totalFeedback: 0,
            likedCount: 0,
            dislikedCount: 0,
            error: "Could not load dashboard data."
        });
    }
}

async function handleGetAllUsers(req, res) {
    try {
        const users = await userModel.find({});
        res.render('admin-users', { users, error: null });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.render('admin-users', { users: [], error: "Could not load user data." });
    }
}

async function handleGetUserDetail(req, res) {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        const feedback = await feedbackModel.find({ userId: userId });

        if (!user) {
            return res.render('admin-user-detail', { user: null, feedback: [], error: "User not found." });
        }

        res.render('admin-user-detail', { user, feedback, error: null });

    } catch (error) {
        console.error("Error fetching user details:", error);
        res.render('admin-user-detail', { user: null, feedback: [], error: "Could not load user details." });
    }
}

module.exports = {
    handleAdminDashboard,
    handleGetAllUsers,
    handleGetUserDetail
};
