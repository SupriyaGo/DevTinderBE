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
		gender: body.gender,
	};
	const user = new User(body);
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
app.patch("/user", async (req, res) => {
	try {
		const id = req.body.id;
		const data = {
			lastName: req.body.lastName,
			email: req.body.email,
		};
		const result = await User.findByIdAndUpdate({ _id: id }, req.body, {
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
app.patch("/userByEmail", async (req, res) => {
	try {
		const email = req.body.email;
		const data = {
			lastName: req.body.lastName,
			email: req.body.newEmail,
		};
		const result = await User.findOneAndUpdate({ email }, data, {
			returnDocument: "after",
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

connectDB()
	.then(() => {
		console.log("Database connected successfully");
		app.listen(3000, () => console.log("Server is running on port 3000"));
	})
	.catch((error) => console.log("Database connection failed", error));
