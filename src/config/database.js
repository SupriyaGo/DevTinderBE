/** @format */

const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://supriyagorai1995:Qjp8ib6sUVaLLJ2m@devtinder.geqepdk.mongodb.net/devTinder"
		);
	} catch (error) {
		console.error("Database connection error:", error);
	}
};

module.exports = connectDB;
