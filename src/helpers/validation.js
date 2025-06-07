const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body

    if(!firstName) {
        throw new Error("First name is required")
    }
    if(!validator.isEmail(email)) {
        throw new Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough")
    }
};

const validateEditProfileData = (req) => {
    const body = req.body;
    const ALLOWED_FIELDS = [
        "firstName",
        "lastName",
        "photo",
        "skills",
        "about"
    ];
    const isUpdateAllowed = Object.keys(body).every(key => ALLOWED_FIELDS.includes(key));
    if (!isUpdateAllowed) {
        throw new Error("Invalid Edit Request");
    }
    return isUpdateAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData }