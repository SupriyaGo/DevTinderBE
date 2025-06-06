/** @format */

const express = require("express");
const cookireParser = require("cookie-parser");
const connectDB = require("./config/database");

const app = express();
const PORT = 9000
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const learningRoutes = require("./routes/learning");
const requestRoutes = require("./routes/rquest");

app.use(express.json());
app.use(cookireParser());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", learningRoutes);
app.use("/", requestRoutes);


connectDB()
	.then(() => {
		console.log("Database connected successfully");
		app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
	})
	.catch((error) => console.log("Database connection failed", error));
