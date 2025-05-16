/** @format */

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
	const userObj = {
		firstName: "Aditi",
		lastName: "Chakraborty",
		email: "aditi@mail.com",
		age: 30,
		gender: "male",
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

connectDB()
	.then(() => {
		console.log("Database connected successfully");
		app.listen(3000, () => console.log("Server is running on port 3000"));
	})
	.catch((error) => console.log("Database connection failed", error));
