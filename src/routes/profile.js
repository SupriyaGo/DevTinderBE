const express = require("express");
const bcrypt = require("bcrypt");
const {userAuth} = require("../middlewares/auth")
const User = require("../models/user"); // Assuming you have a User model defined
const {validateEditProfileData} = require("../helpers/validation")

const router = express.Router();

// Get profile details of the user
router.get("/profile/view", userAuth, async (req, res) => {
	try {
		const user = req.user; // User is attached to the request object by the middleware
		res.send(user);
	} catch (error) {
		res.status(400).send("Error getting profile: " + error.message);
		
	}
});

// Edit profile details of the user
router.patch("/profile/edit", userAuth, async (req, res) => {
	try{
		const isValid = validateEditProfileData(req);
		const userData = req.user; // User is attached to the request object by the middleware
		
		if(isValid) {			
			Object.keys(req.body).forEach((keys) => userData[keys] = req.body[keys]);
			
			await userData.save(); // Save the updated user data to the database
			res.json({message: "Profile updated successfully", data: userData});
		}
		
	} catch (error) {
		res.status(400).send("Error updating profile: " + error.message);
	}
})

// Forgot password
router.patch("/profile/password", userAuth, async (req, res) => {
	try {
		const ALLOWED_FIELDS = ["password"];
		const isUpdateAllowed = Object.keys(req.body).every(key => ALLOWED_FIELDS.includes(key));
		if (!isUpdateAllowed) {
			throw new Error("Invalid Request");
		}
		const nePasswordHash = await bcrypt.hash(req.body.password, 10);
		req.user.password = nePasswordHash;
		await req.user.save();
		res.json({message: "Password updated successfully"});
	} catch (error) {
		res.status(400).send("Error updating password: " + error.message);
	}
})

module.exports = router;