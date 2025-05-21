/** @format */

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const validator = require("validator");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./helpers/validation")

app.use(express.json());

// Sign up API - POST /signup
app.post("/signup", async (req, res) => {
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
app.post("/signin", async (req, res) => {
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

		const isPasswordValisd = await bcrypt.compare(body.password, user.password);
		if (!isPasswordValisd) {
			throw new Error("Invalid credentials");
		}
		res.send("User signed in successfully!!");
	} catch (error) {
		console.error("Error signing in", error);
		res.status(400).send("Error: " + error.message);		
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
