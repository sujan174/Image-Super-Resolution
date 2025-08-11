const jwt = require("jsonwebtoken");

function checkForAuthentication(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/user/login");
    }

    try {
        const userPayload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = userPayload;
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/user/login");
    }

    return next();
}

module.exports = checkForAuthentication;
