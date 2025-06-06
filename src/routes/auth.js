const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");
const {validateSignUpData} = require("../helpers/validation");

const router = express.Router();

// Sign up API - POST /signup
router.post("/signup", async (req, res) => {
	const body = req.body;

	try {
		// Validation of data
		validateSignUpData(req);

		// Encrypt the password
		const passwordHash = await bcrypt.hash(body.password, 10);
		body.password = passwordHash;

		const ALLOWED_FIELDS = [
			"firstName",
			"lastName",
			"email",
			"password",
			"age",
			"gender",
			"photo",
			"skills",
			"about"
		]
		const isSignUpAllowed =  Object.keys(body).every((key) => ALLOWED_FIELDS.includes(key))
		if(!isSignUpAllowed) {
			throw new Error("Invalid fields");
		}
		if(body.skills?.length > 25) {
			throw new Error("Skills should be less than 25");
		}
		const user = new User(body);
		await user.save();
		res.send("User created successfully!!");
	} catch (error) {
		console.error("Error creating user", error);
		res.status(400).send("Error: " + error.message);
	}
});

// Sign in API - POST /signin
router.post("/signin", async (req, res) => {
	const body = req.body;
	try {
		const isEmailValid = validator.isEmail(body.email);
		if (!isEmailValid) {
			throw new Error("Email is not valid");
		} 
		const user = await User.findOne({email: body.email});
		if(!user) {
			throw new Error("User not found");
		}

		const isPasswordValisd = await user.verifyPassword(body.password);
		if (!isPasswordValisd) {
			throw new Error("Invalid credentials");
		}
		// Generate JWT token
		var token = await user.getJWT();
		// Set the token in cookies
		res.cookie("token", token)
		res.send("User signed in successfully!!");
	} catch (error) {
		console.error("Error signing in", error);
		res.status(400).send("Error: " + error.message);		
	}
});


module.exports = router;