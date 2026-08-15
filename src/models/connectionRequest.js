const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", 'interested', 'accepeted', 'rejected'],
            message: `{VALUE} is incorrect status type`
        }
    }
}, {
    timestamps: true
})

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    const fromUserId = connectionRequest.fromUserId;
    const toUserId = connectionRequest.toUserId;
    if (fromUserId.equals(toUserId)) {
        throw new Error("You can not send a connection request to your self")
        // return next(new Error('You can not send a connection request to your self'))
    }
    next()
})
// Compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel

