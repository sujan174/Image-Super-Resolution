const userModel = require('../../models/user');
const feedbackModel = require('../../models/feedback');

async function handleAdminDashboard(req, res) {
    try {
        const users = await userModel.find({}).lean();
        const feedback = await feedbackModel.find({}).lean();
        
        const totalUpscales = users.reduce((sum, user) => sum + (user.imageHistory ? user.imageHistory.length : 0), 0);
        
        const likedCount = feedback.filter(f => f.likedResult).length;
        const dislikedCount = feedback.length - likedCount;

        const modelUsage = feedback.reduce((acc, item) => {
            acc[item.modelUsed] = (acc[item.modelUsed] || 0) + 1;
            return acc;
        }, {});

        res.render('admin-dashboard', {
            totalUsers: users.length,
            totalUpscales: totalUpscales,
            likedCount,
            dislikedCount,
            edsrCount: modelUsage['EDSR'] || 0,
            realesrganCount: modelUsage['RealESRGAN'] || 0,
            swinirCount: modelUsage['SwinIR'] || 0,
            error: null
        });

    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.render('admin-dashboard', {
            totalUsers: 0,
            totalUpscales: 0,
            likedCount: 0,
            dislikedCount: 0,
            edsrCount: 0,
            realesrganCount: 0,
            swinirCount: 0,
            error: "Could not load dashboard data."
        });
    }
}

async function handleGetAllUsers(req, res) {
    try {
        const users = await userModel.find({}).lean();
        res.render('admin-users', { users, error: null });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.render('admin-users', { users: [], error: "Could not load user data." });
    }
}

async function handleGetUserDetail(req, res) {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).lean();
        const feedback = await feedbackModel.find({ userId: userId }).lean();

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
