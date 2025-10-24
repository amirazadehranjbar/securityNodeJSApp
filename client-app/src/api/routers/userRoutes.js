import express from "express";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userRoutes = express.Router();

// region register user
userRoutes.post("/users/register" , async (req, res)=>{

    try {
        const {username, password} = req.body;

        // check username and password
        if(!username || !password){
            return res.status(400).json("username and password is required!")
        }

        // check user exist ************************************************
        const isExist = await UserModel.findOne({username:username});
        if(isExist){
            return res.status(400).json(`user is exist : ${username}`)
        }

        // hash password ***************************************************
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // register user ****************************************************
        const user = await new UserModel({username, password:hashedPassword});

        await user.save();

        // generate token for new user **************************************
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // save generated toke in cookie ************************************
        res.cookie("jwt", token, {
            httpOnly: true, // avoid accesses java script to cookie
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict", //  CSRF
            maxAge: 3600000 // 1 hour for expire token
        });

        // send response to user *********************************************
        return res.status(201).json({ message: "User registered successfully", username });

    } catch (e) {
        return res.status(500).json(e.message || "error");
    }

});
// endregion



export default userRoutes;