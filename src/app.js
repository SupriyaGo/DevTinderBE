/** @format */

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
	const body = req.body;
	
	try {
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
app.patch("/user/:id", async (req, res) => {
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
app.patch("/userByEmail/:email", async (req, res) => {
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

connectDB()
	.then(() => {
		console.log("Database connected successfully");
		app.listen(3000, () => console.log("Server is running on port 3000"));
	})
	.catch((error) => console.log("Database connection failed", error));
