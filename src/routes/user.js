const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const Request = require("../models/request");

const router = express.Router();

// API - GET all the pending connection requests of the user - /user/requests
router.get("/user/requests", userAuth ,async (req, res) => {
	try {
		const userData = req.user;

		const request = await Request.find({receiverId: userData._id, status: "interested"}).populate("senderId", "firstName lastName age about photo");
		
		res.json({message: "Requests fetched successfully", data: request});
	} catch (error) {
		res.status(400).send("Error getting requests: " + error.message);
	}
})

// API - /user/connections, get alll the connections of the user



// Feed API - GET /feed get all the users
router.get("/user/feed", async (req, res) => {
	try {
		const result = await User.find({});

		if (result.length === 0) {
			res.status(400).send("No user found");
		} else {
			res.send(result);
		}
	} catch (error) {
		console.error("Error getting users", error);
		res.status(400).send("Error getting users: " + error.message);
	}
});


module.exports = router;