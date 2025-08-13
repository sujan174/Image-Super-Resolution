const userModel = require('../../models/user');

async function handleAdminDashboard(req, res) {
    try {
        const users = await userModel.find({}).lean();
        
        let totalUpscales = 0;
        let likedCount = 0;
        let dislikedCount = 0;
        const modelUsage = { EDSR: 0, RealESRGAN: 0, SwinIR: 0 };

        users.forEach(user => {
            if (user.imageHistory) {
                totalUpscales += user.imageHistory.length;
                user.imageHistory.forEach(item => {
                    if (item.likedResult === true) {
                        likedCount++;
                    } else if (item.likedResult === false) {
                        dislikedCount++;
                    }
                    if (item.modelUsed in modelUsage) {
                        modelUsage[item.modelUsed]++;
                    }
                });
            }
        });

        res.render('admin-dashboard', {
            totalUsers: users.length,
            totalUpscales,
            likedCount,
            dislikedCount,
            edsrCount: modelUsage.EDSR,
            realesrganCount: modelUsage.RealESRGAN,
            swinirCount: modelUsage.SwinIR,
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

        if (!user) {
            return res.render('admin-user-detail', { user: null, error: "User not found." });
        }

        res.render('admin-user-detail', { user, error: null });

    } catch (error) {
        console.error("Error fetching user details:", error);
        res.render('admin-user-detail', { user: null, error: "Could not load user details." });
    }
}

async function handleAdminFeedbackView(req, res) {
    try {
        const { status } = req.query;
        const likedResult = status === 'liked';
        
        const usersWithFeedback = await userModel.find({ 'imageHistory.likedResult': likedResult }).lean();
        
        const feedbackItems = usersWithFeedback.flatMap(user => 
            user.imageHistory
                .filter(item => item.likedResult === likedResult)
                .map(item => ({ 
                    ...item, 
                    userName: user.name,
                    originalImageFilename: item.originalPath,
                    upscaledImageFilename: item.upscaledPath,
                    modelUsed: item.modelUsed,
                    scaleFactor: item.scaleFactor
                }))
        );
        
        res.render('admin-feedback', {
            feedback: feedbackItems,
            title: likedResult ? 'Liked Images' : 'Disliked Images',
            error: null
        });

    } catch (error) {
        console.error("Error fetching feedback data:", error);
        res.render('admin-feedback', {
            feedback: [],
            title: 'Error',
            error: "Could not load feedback data."
        });
    }
}

module.exports = {
    handleAdminDashboard,
    handleGetAllUsers,
    handleGetUserDetail,
    handleAdminFeedbackView,
};
