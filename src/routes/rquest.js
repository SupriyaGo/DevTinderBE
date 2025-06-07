const express = require('express');
const Request = require("../models/request");
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

// API - connection send -  Request type - interested, ignored
router.post("/request/send/:status/:receiverId", userAuth ,async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const status = req.params.status;

        // Sanitation - only allowed satatus values are interested and ignored
        const allowedStatuses = ['interested', 'ignored'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status value");
        }
        // Validation - 1. duplicate request should not be allowed
        // 2. if receiver is also sending a request to sender
        // $OR and $AND query in mongoose
        const existingRequest = await Request.findOne({
            $or:[
                {senderId, receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        })
        if (existingRequest) {
            return res.status(400).send("Request already exists between these users");
        }
        // 3. sender and receiver should not be same - Done using pre hook in request model
        // Scheme.pre function

        // indexing - normal index, compound index
        // Why do we need index in DB?
        // What are the advantages of indexing?
        // What are the disadvantages of indexing?

        const request = new Request({
            senderId,
            receiverId,
            status
        });
        
        const data = await request.save();
        res.json({ message: "Request sent successfully", data });
        
    } catch (error) {
        res.status(400).send("Error sending request: " + error.message);
    }
});

// API - connection review - Request type - accepted, rejected
router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const userData = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;
        // validation - 1. alllwed status values are accepted and rejected
        //  2. requestId should be valid
        //  3. user should be receiver of the request
        //  4. request type should be interested
        
        const allowedStatuses = ['accepted', 'rejected'];
        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const request = await Request.findOne({
            _id: requestId,
            receiverId: userData._id,
            status: 'interested'
        })
        if(!request) {
            return res.status(400).json({ message: "Request not found or you are not authorized to review this request" });
        }
        request.status = status; 
        const data =  await request.save();
        res.json({message: "Connection request "+ status + " successfully", data});
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
});

module.exports = router;