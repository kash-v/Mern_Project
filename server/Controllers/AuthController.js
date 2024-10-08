const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary");

dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
var upload = multer({
    storage: storage
});

//Signup Route
const signup = async (req, res) => {
    try {
        const { firstName, lastName, userBio, userEmail, userMobile, userName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(401).send("User Already Exists with this email");
        }

        // Check if file is provided
        if (!req.file) {
            return res.status(400).json({ error: "No Profile Image Provided" });
        }

        // Upload profile image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);

        // Hash the password
        const password = req.body.userPassword;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const encryptedPassword = await bcrypt.hash(password, salt);

        console.log("Request Body: ", req.body);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            userBio,
            userEmail,
            userMobile,
            userName,
            userPassword: encryptedPassword,
            profileImage: result.secure_url
        });

        // Save the new user to the database
        await newUser.save();

        // Send success response
        return res.status(200).json({
            status: "Ok",
            user: newUser
        });

    } catch (error) {
        // Send error response
        return res.status(400).json({ error: error.message });
    }
};



const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        
        // Log the incoming email
        console.log("Login attempt with email: ", userEmail);

        // Check if the user exists
        const user = await User.findOne({ userEmail });

        if (user) {
            console.log("User found: ", user);

            // Compare the password
            const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
            if (passwordMatch) {
                return res.json(user);
            } else {
                console.log("Password mismatch");
                return res.json({ status: "Error", getUser: false });
            }
        } else {
            console.log("User not found");
            return res.json({ status: "Error", getUser: false });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = { signup, login };