/** @format */

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
		minLength: 2,
		maxLength: 50,
	},
	lastName: {
		type: String,
		trim: true,
		maxLength: 50,
		default: ""
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 2,
		maxLength: 50,
		unique: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error(`${value} is not a valid email!`);
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: 2,
		validate(value) {
			if (!validator.isStrongPassword(value)) {
				throw new Error(`Not a valid PASSWORD!`);
			}
		}
	},
	age: {
		type: Number,
		trim: true,
		min: 14
	},
	gender: {
		type: String,
		trim: true,
		validate (value) {
			if(!["male", "female", "other"].includes(value)) {
				throw new Error("Not a valid age");
			}
		}
	},
	photo: {
		type: String,
		trim: true,
		default: "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-avatar-placeholder-png-image_3416697.jpg",
		validate(value) {
			if (!validator.isURL(value)) {
				throw new Error(`${value} is not a valid URL!`);
			}
		}
	},
	skills: {
		type: [String]
	},
	about: {
		type: String,
		trim: true,
		default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
	},
}, {timestamps: true});

userSchema.methods.verifyPassword = async function(inputPasseord) {
	const passwordHash = this.password;
	const isPasswordValisd = await bcrypt.compare(inputPasseord, passwordHash);
	return isPasswordValisd
}

userSchema.methods.getJWT = async function() {
	const id = this._id;
	const token = await jwt.sign({ _id: id }, 'Dev@Tinder#2025');
	return token;
};


const User = mongoose.model("User", userSchema);

module.exports = User;
