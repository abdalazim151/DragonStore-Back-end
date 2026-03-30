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
    // const isPassowrd = user.comparePassword(password)
const isPassowrd = await user.comparePassword(password)
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
export const getUsers = asyncHandler(async (req, res, next) => {
    const { role, page = 1, limit = 50 } = req.query;

    const allowedRoles = ['user', 'admin', 'seller'];

    if (role && !allowedRoles.includes(role)) {
        return next(new appError("Invalid role", 400));
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};
    if (role) {
        filter.roles = role;
    }

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
        .select('firstName lastName email img roles')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const formattedUsers = users.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        img: user.img,
        roles: user.roles
    }));

    res.status(200).json({
        status: "success",
        results: formattedUsers.length,
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limitNumber)
        },
        data: formattedUsers
    });
});

export const getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.query;

    const allowedRoles = ['user', 'admin', 'seller'];

    if (role && !allowedRoles.includes(role)) {
        return next(new appError("Invalid role", 400));
    }

    const filter = { _id: id };

    if (role) {
        filter.roles = role;
    }

    const user = await User.findOne(filter)
        .select('firstName lastName email img roles');

    if (!user) {
        return next(new appError("User not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            img: user.img,
            roles: user.roles
        }
    });
});