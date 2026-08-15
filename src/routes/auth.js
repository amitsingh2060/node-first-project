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
        const { emailId, password } = req.body
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Emaul is not in db")
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid email or password");
        }
        // Create JWT
        // const token = jwt.sign(
        //     { _id: user._id, emailId: user.emailId },
        //     "mySecretKey",
        //     { expiresIn: '1d' }
        // )
        const token = user.getJWT();
        console.log("token", token);
        // Add the token to cookies and send respons to the user 
        res.cookie("token", token, {
            // httpOnly: true,
            // maxAge: 24 * 60 * 60 * 1000
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
        });
        return res.status(200).send("Login successful");
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successfull")
})

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