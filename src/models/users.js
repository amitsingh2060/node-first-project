const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true

    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gener invalid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://media.gettyimages.com/id/105784015/photo/seamstress-in-her-studio.jpg?s=612x612&w=gi&k=20&c=HE1wVs1ud-WkYHTq6RoHDarK0dVgRz8bAK5wLUp33Ls='
    },
    about: {
        type: String,
        default: 'this is '
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User