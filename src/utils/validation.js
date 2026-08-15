var validator = require('validator');

const validateSignup = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName) {
        throw new Error("name is not valid")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email  is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Pls enter strong pass")
    }

}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "age",
        "gender",
        "about",
        "skills"
    ];

    return Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
};

module.exports = {
    validateSignup,
    validateEditProfileData
}