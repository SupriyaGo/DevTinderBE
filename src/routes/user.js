const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const Request = require("../models/request");

const router = express.Router();

// API - GET all the pending connection requests of the user - /user/requests
router.get("/user/requests", userAuth ,async (req, res) => {
	try {
		const userData = req.user;

		const request = await Request.find({receiverId: userData._id, status: "interested"}).populate("senderId", "firstName lastName age about photo");
		
		res.json({message: "Requests fetched successfully", data: request});
	} catch (error) {
		res.status(400).send("Error getting requests: " + error.message);
	}
})

// API - /user/connections, get all the connections of the user
router.get("/user/connections", userAuth, async (req, res) => {
	try {
		const userData = req.user;

		const connections = await Request.find({
			$or: [
				{ senderId: userData._id, status: "accepted" },
				{ receiverId: userData._id, status: "accepted" }
			]
		})
		.populate("senderId", "firstName lastName age about photo")
		.populate("receiverId", "firstName lastName age about photo");

		const data = connections.map(connection => {
			if(connection.senderId._id.equals(userData._id)) {
				return connection.receiverId
			}
			else {
				return connection.senderId
			}
		})

		res.json({message: "Connections fetched successfully", data});
	} catch (error) {
		res.status(400).send("Error getting connections: " + error.message);
	}
})



// Feed API - GET /feed get all the users
router.get("/user/feed", userAuth ,async (req, res) => {
	// User should see all the users except 
	// 1. his own
	// 2. his connections
	// 3. ignored profile
	// 4. already sent the connection request
	try {
		const userData = req.user;
		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 50 ? 50 : limit; // Limit the maximum number of results to 50
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;

		const connections = await Request.find({
			$or: [
				{ senderId: userData._id },
				{ receiverId: userData._id }
			]
		}).select("senderId receiverId");

		const connectionIds = connections.map(connection => {
			if(connection.senderId.equals(userData._id)) {
				return connection.receiverId;
			} else {
				return connection.senderId;
			}
		});

		const ignoredRequests = await Request.find({ 
			senderId: userData._id, 
			status: "ignored" 
		}).select("receiverId");

		const ignoredIds = ignoredRequests.map(request => request.receiverId);

		const users = await User.find({
			_id: { $nin: [userData._id, ...connectionIds, ...ignoredIds] }
		}).select("firstName lastName age about photo").skip(skip).limit(limit);

		res.json({message: "Feed fetched successfully", data: users});
	} catch (error) {
		res.status(400).send("Error getting feed: " + error.message);
	}
	
});


module.exports = router;