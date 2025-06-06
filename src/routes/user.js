const express = require("express");
const User = require("../models/user");

const router = express.Router();


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