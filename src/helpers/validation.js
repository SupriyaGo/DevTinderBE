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

module.exports = { validateSignUpData }