const jwt = require('jsonwebtoken');
const User = require("../models/user");


const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
		if(!token) {
			throw new Error("Invalid token!!");
		}
		const decodedToken = jwt.verify(token, 'Dev@Tinder#2025')
		const {_id} = decodedToken;
		const user = await User.findById(_id);
        if (!user) {
			throw new Error("User not found");
		} 
        req.user = user; // Attach user to request object
	    next()
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
   
	
}

module.exports = {userAuth};