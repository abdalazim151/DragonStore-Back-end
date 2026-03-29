import asyncHandler from 'express-async-handler';
import { appError } from '../utils/appError.js';
import { generateRefreshToken, generateToken } from "../services/auth.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) 
        return next(new appError("Invalid email or password", 400));
    if (user.googleId && !user.password) 
        return next(new appError("This account is registered with Google. Please use Google Login.", 400));
    const isPassowrd = user.comparePassword(password)
    if(!isPassowrd){
            return next(new appError("Invalid email or password", 400));
    }
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        accessToken,
        refreshToken
    });
});

export const register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, roles } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) 
        return next(new appError("User already exists!", 400));
    const imageUrl = req.file ? req.file.path : process.env.DEFAULT_IMAGE_URL;
    const userData = {
        firstName,
        lastName,
        email,
        password,
        img: imageUrl
    };
    if (roles) 
        userData.roles =roles.split(',');
    const user = await User.create(userData);
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(201).json({
        status: "success",
        message: "User Registered Successfully",
        accessToken,
        refreshToken
    });
});