const express = require("express");
const {userAuth} = require("../middlewares/auth")

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

module.exports = router;