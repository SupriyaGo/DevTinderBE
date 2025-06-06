const express = require("express");
const User = require("../models/user");

const router = express.Router();


// Get user by email
router.get("/user", async (req, res) => {
	try {
		const email = req.body.email;
		const result = await User.find({ email });

		if (result.length === 0) {
			res.status(400).send("Email not found");
		} else {
			res.send(result);
		}
	} catch (error) {
		console.error("Error getting user", error);
		res.status(400).send("Error getting user: " + error.message);
	}
});

// Delete a user
router.delete("/user", async (req, res) => {
	try {
		const id = req.body.id;
		const result = await User.findByIdAndDelete(id);

		if (!result) {
			res.status(400).send("User not found");
		} else {
			res.send("User deleted successfully: " + result);
		}
	} catch (error) {
		console.error("Error deleting user", error);
		res.status(400).send("Error deleting user: " + error.message);
	}
});

// Update a user
router.patch("/user/:id", async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	try {
		const ALLOWED_FIELDS = [
			"firstName",
			"lastName",
			"password",
			"photo",
			"skills",
			"about"
		]
		const isUpdateAllowed =  Object.keys(body).every((key) => ALLOWED_FIELDS.includes(key))
		if(!isUpdateAllowed) {
			throw new Error("Update not allowed");
		}
		if(body.skills?.length > 25) {
			throw new Error("Skills should be less than 25");
		}
		
		const result = await User.findByIdAndUpdate({ _id: id }, body, {
			returnDocument: "after",
			runValidators: true,
		});

		if (!result) {
			res.status(400).send("User not found");
		} else {
			res.send("User updated successfully: " + result);
		}
	} catch (error) {
		console.error("Error updating user", error);
		res.status(400).send("Error updating user: " + error.message);
	}
});

// Update user by email
router.patch("/userByEmail/:email", async (req, res) => {
	const body = req.body;
	const email = req.params.email;
	try {
		const ALLOWED_FIELDS = [
			"firstName",
			"lastName",
			"password",
			"photo",
			"skills",
			"about"
		]
		const isUpdateAllowed =  Object.keys(body).every((key) => ALLOWED_FIELDS.includes(key))
		if(!isUpdateAllowed) {
			throw new Error("Update not allowed");
		}
		if(body.skills?.length > 25) {
			throw new Error("Skills should be less than 25");
		}
		const result = await User.findOneAndUpdate({ email }, body, {
			returnDocument: "after",
			runValidators: true,
		});

		if (!result) {
			res.status(400).send("User not found");
		} else {
			res.send("User updated successfully: " + result);
		}
	} catch (error) {
		console.error("Error updating user", error);
		res.status(400).send("Error updating user: " + error.message);
	}
});

module.exports = router;