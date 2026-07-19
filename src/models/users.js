const mongoose = require('mongoose');
var validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

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
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email")
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("not strong pass")
            }
        }
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
        default: 'https://media.gettyimages.com/id/105784015/photo/seamstress-in-her-studio.jpg?s=612x612&w=gi&k=20&c=HE1wVs1ud-WkYHTq6RoHDarK0dVgRz8bAK5wLUp33Ls=',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("not valid url")
            }
        }
    },
    about: {
        type: String,
        default: 'this is '
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })


userSchema.methods.getJWT = function () {
    const user = this;
    return jwt.sign(
        {
            _id: user._id,
            emailId: user.emailId
        },
        "mySecretKey",
        { expiresIn: "1d" }
    );
};

userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;

    const isPasswordValid = await bcrypt.compare(
        passwordInput,
        user.password
    );

    return isPasswordValid;
};

const User = mongoose.model('User', userSchema);

module.exports = User