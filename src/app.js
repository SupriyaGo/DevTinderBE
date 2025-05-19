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

// Feed API - GET /feed get all the users

// Delete a user

// Update a user

// Update user by email

connectDB()
	.then(() => {
		console.log("Database connected successfully");
		app.listen(3000, () => console.log("Server is running on port 3000"));
	})
	.catch((error) => console.log("Database connection failed", error));
