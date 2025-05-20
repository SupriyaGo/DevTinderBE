/** @format */

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
	console.log("Request body:", req.body);

	const body = req.body;

	const userObj = {
		firstName: body.firstName,
		lastName: body.lastName,
		email: body.email,
		age: body.age,
		gender: body.gender,
	};
	const user = new User(userObj);
	try {
		await user.save();
		res.send("User created successfully!!");
	} catch (error) {
		console.error("Error creating user", error);
		res.status(400).send("Error creating user: " + error.message);
	}
});

// Get user by email
app.get("/user", async (req, res) => {
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

// Feed API - GET /feed get all the users
app.get("/feed", async (req, res) => {
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

// Delete a user
app.delete("/user", async (req, res) => {
	try {
		const id = req.body.id;
		const result = await User.findByIdAndDelete(id);
		console.log("====result", result);

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

// Update user by email

connectDB()
	.then(() => {
		console.log("Database connected successfully");
		app.listen(3000, () => console.log("Server is running on port 3000"));
	})
	.catch((error) => console.log("Database connection failed", error));
