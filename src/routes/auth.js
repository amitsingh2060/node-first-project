const express = require("express");
const authRouter = express.Router();

const User = require("../models/users");
const bcrypt = require("bcrypt");
const { validateSignup } = require("../utils/validation");

authRouter.post('/signup', async (req, res) => {
    try {
        console.log("API called");
        // validation of data
        validateSignup(req)
        const { firstName, lastName, emailId, password } = req.body
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log("passwordHash", passwordHash);

        // Creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await user.save();
        res.send("User added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = user.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        return res.status(200).json({
            message: "Login successful",
            data: user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        message: "Logout successful"
    });
});

authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { emailId } = req.body
        const user = await User.findOne({ emailId })
        if (!user) {
            res.status(404).send("user not found")
        }
    } catch (error) {

    }
    res.send("Forgot password")
})

module.exports = authRouter;