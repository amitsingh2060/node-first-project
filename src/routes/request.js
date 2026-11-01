const express = require('express');
const mongoose = require('mongoose');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/users')

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }
        // if there is an existing connection req
        // const existingConnectionRequest = await connectionRequest.findOne({
        //     $or: [
        //         { fromUserId, toUserId },
        //         { fromUserId: toUserId, toUserId: fromUserId }
        //     ]

        // })
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection request already exists" })
        }
        // Check if toUserId is a valid MongoDB ObjectId
        // if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        //     return res.status(400).json({
        //         message: "Invalid user ID"
        //     });
        // }
        const user = await User.findById(toUserId);
        if (!user) {
            return res.status(404).send({ message: "User does not exist" })
        }
        const data = await connectionRequest.save();

        res.json({
            message: 'Connection Request sent successfully',
            data
        })
    } catch (error) {
        res.status(400).send("ERROR " + error.message)
    }
    // res.send(user.firstName + " Connectiion Request sent")
})


requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        console.log(loggedInUser, "loggedInUser");
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: 'Status not allowed'
            })
        }

        const connectionRequest = await ConnectionRequest.findById({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found"
            })
        }


        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: "Success",
            status, data

        });

    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR " + error.message);
    }
})


module.exports = requestRouter;