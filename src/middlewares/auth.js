const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userAuth = async (req, res, next) => {
    try {
        // Read the token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send("Please login");
        }

        // Verify token
        const decoded = jwt.verify(token, "mySecretKey");

        // Find user
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Attach user to request
        req.user = user;

        // Continue to next middleware/route
        next();

    } catch (error) {
        return res.status(401).send("Invalid token");
    }
};

module.exports = {
    userAuth
};