import asyncHandler from 'express-async-handler';
import { appError } from '../utils/appError.js';
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const Resolve = (req, res) => {
    const { token, refreshToken } = req.user;
    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        accessToken: token,
        refreshToken: refreshToken
    });
};

export const auth = asyncHandler(async (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization)
        return next(new appError("Where is Token!", 401));

    const token = authorization.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;

    const v = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(v.id);
    if (!user) {
        return next(new appError("The user belonging to this token no longer exists.", 401));
    }

    req.roles = user.roles;
    req.user = user;
    next();
});

export const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!req.roles || !req.roles.some(role => roles.includes(role))) {
            return next(new appError("You do not have permission to perform this action", 403));
        }
        next();
    };
};

export const refreshToken = asyncHandler(async (req, res, next) => {
    let { refreshToken } = req.body;
    if (!refreshToken)
        return next(new appError("Refresh token is required!", 400));

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
        return next(new appError("User not found", 404));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
        status: "success",
        token
    });
});