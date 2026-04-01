import asyncHandler from 'express-async-handler';
import { appError } from '../utils/appError.js';
import { generateRefreshToken, generateToken } from "../services/auth.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";
// import Order from "../models/order.js";
import Order from "../models/productBase.js";
import Cart from  "../models/cart.js"
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
        return next(new appError("Invalid email or password", 400));

    if (user.googleId && !user.password)
        return next(new appError("This account is registered with Google. Please use Google Login.", 400));

    const isPassowrd = await user.comparePassword(password);

    if (!isPassowrd) {
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
        userData.roles = roles.split(',');

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

export const getTopBuyers = asyncHandler(async (req, res, next) => {
    const limit = Math.max(Number(req.query.limit) || 1, 1);

    const topBuyers = await Cart.aggregate([
        {
            $match: {
                status: "accepted"
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $group: {
                _id: "$user",
                totalSpent: {
                    $sum: {
                        $multiply: ["$quantity", "$product.price"]
                    }
                },
                ordersCount: { $sum: 1 }
            }
        },
        {
            $sort: {
                totalSpent: -1,
                ordersCount: -1
            }
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 0,
                userId: "$user._id",
                name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
                email: "$user.email",
                img: "$user.img",
                roles: "$user.roles",
                totalSpent: 1,
                ordersCount: 1
            }
        }
    ]);

    res.status(200).json({
        status: "success",
        results: topBuyers.length,
        data: topBuyers
    });
});


export const getTopSellers = asyncHandler(async (req, res, next) => {
    const limit = Math.max(Number(req.query.limit) || 1, 1);

    const topSellers = await Cart.aggregate([
        {
            $match: {
                status: "accepted"
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $group: {
                _id: "$product.user",
                totalRevenue: {
                    $sum: {
                        $multiply: ["$quantity", "$product.price"]
                    }
                },
                totalUnitsSold: {
                    $sum: "$quantity"
                },
                ordersCount: {
                    $sum: 1
                },
                productsSold: {
                    $addToSet: "$product._id"
                }
            }
        },
        {
            $sort: {
                totalRevenue: -1,
                totalUnitsSold: -1,
                ordersCount: -1
            }
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "seller"
            }
        },
        {
            $unwind: "$seller"
        },
        {
            $project: {
                _id: 0,
                sellerId: "$seller._id",
                name: { $concat: ["$seller.firstName", " ", "$seller.lastName"] },
                email: "$seller.email",
                img: "$seller.img",
                roles: "$seller.roles",
                totalRevenue: 1,
                totalUnitsSold: 1,
                ordersCount: 1,
                productsCount: { $size: "$productsSold" }
            }
        }
    ]);

    res.status(200).json({
        status: "success",
        results: topSellers.length,
        data: topSellers
    });
});


