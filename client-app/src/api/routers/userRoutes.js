// src/redux/features/userReducer.js
//region imports
import express from "express";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {ChalkActions} from "../../chalkActions/chalkActions.js";
//endregion

const userRoutes = express.Router();

// region register user
userRoutes.post("/users/register", async (req, res) => {

    try {
        const {username, password} = req.body;

        // check username and password
        if (!username || !password) {
            return res.status(400).json("username and password is required!")
        }

        // check user exist ************************************************
        const isExist = await UserModel.findOne({username: username});
        if (isExist) {
            return res.status(400).json(`user is exist : ${username}`)
        }

        // hash password ***************************************************
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // register user ****************************************************
        const user = await new UserModel({username, password: hashedPassword});

        await user.save();

        // generate token for new user **************************************
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        ChalkActions({message: "token generated"});

        // save generated toke in cookie ************************************
        res.cookie("jwt", token, {
            httpOnly: true, // avoid accesses java script to cookie
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict", //  CSRF
            maxAge: 3600000 // 1 hour for expire token
        });

        // send response to user *********************************************
        return res.status(201).json({message: "User registered successfully", username});

    } catch (e) {
        return res.status(500).json("Internal server error");
    }

});
// endregion


// region login
userRoutes.post("/users/login", async (req, res) => {
    try {
        const {username, password} = req.body;


        if (!username || !password) {
            return res.status(400).json({message: "Username and password are required"});
        }


        const user = await UserModel.findOne({username});
        if (!user) {
            return res.status(401).json({message: "Invalid credentials"});
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        ChalkActions({
            message: `[LOGIN] JWT generated for user: ${username}`
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        });


        ChalkActions({
            message: `[LOGIN SUCCESS] User logged in: ${username}`
        });


        return res.status(200).json({message: "Login successful", username});

    } catch (e) {
        console.log(`[LOGIN ERROR] Server error: ${e.message}`);
        return res.status(500).json({message: "Internal server error"});
    }
});
// endregion

// region logout
userRoutes.post("/users/logout", async (req, res) => {
    try {
        // Clear JWT cookie
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            path: "/"
        });

        ChalkActions({
            message: "[LOGOUT SUCCESS] User logged out"
        });

        return res.status(200).json({message: "Logout successful"});

    } catch (e) {
        console.log(`[LOGOUT ERROR] Server error: ${e.message}`);
        return res.status(500).json({message: "Internal server error"});
    }
});
// endregion

userRoutes.get("/csrf-token", (req, res) => { res.status(200).json({ message: "CSRF token set" }); });


export default userRoutes;