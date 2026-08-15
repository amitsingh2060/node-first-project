const express = require('express');
const profilerRouter = express.Router()
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');


profilerRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

profilerRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid update fields");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        res.send(loggedInUser);

    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = profilerRouter