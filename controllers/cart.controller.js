import asyncHandler from "express-async-handler";
import cartModel from "../models/cart.js";
import productModel from "../models/productBase.js";
import { calculateCartTotal } from "../utils/cartCalc.js";
import { appError } from "../utils/appError.js";
import { log } from "node:console";
import { sendEmail } from "../services/emailService.js"

// Add Products To Cart

export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    if (!product) {
        return next(new appError("Product not found", 404));
    }

    let item = await cartModel.findOne({
        user: req.user._id,
        product: productId,
        status: "not-confirmed",
    });
    if (item) {
        item.quantity += quantity;
        await item.save();
        return res.status(200).json({
            status: "success",
            message: "Cart updated successfully",
            data: item,
        });
    } else {
        item = await cartModel.create({
            user: req.user._id,
            product: productId,
            quantity,
        });
        return res.status(201).json({
            status: "success",
            message: "Product added to cart successfully",
            data: item,
        });
    }
});

// Get User Cart

export const getUserCart = asyncHandler(async (req, res, next) => {
    const cartItems = await cartModel
        .find({
            user: req.user._id,
            status: "not-confirmed",
        })
        .populate("product");

    if (!cartItems.length) {
        return res.status(200).json({
            status: "success",
            message: "Cart is empty",
            data: [],
        });
    }

    const totalPrice = calculateCartTotal(cartItems);
    return res.status(200).json({
        status: "success",
        message: "Cart retrieved successfully",
        result: cartItems.length,
        totalPrice,
        data: cartItems,
    });
});

// update qty of products with roles

export const updateCartQty = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //   console.log(id);

    const { quantity } = req.body;

    const item = await cartModel.findById(id);
    //   console.log(item);

    // check if found
    if (!item) return next(new appError("Item Not Found", 404));
    // check if not_confirmed
    if (item.status !== "not-confirmed")
        return next(new appError("Can Not Update After Checkout", 400));

    item.quantity = quantity;
    await item.save();

    res.status(200).json({
        status: "success",
        data: item,
    });
});

// checkout when he pay , the products not-confirmed  in cart  change to pending until accept or reject from seller

export const payCart = asyncHandler(async (req, res, next) => {
    const items = await cartModel.find({
        user: req.user._id,
        status: "not-confirmed",
    }).populate({
        path: "product",
        populate: { path: "user", select: "name email" }
    });

    if (!items.length) return next(new AppError("Cart is empty", 400));

    for (const item of items) {
        console.log(`Processing vendor: ${item.product.user.email}`);

        const existingPending = await cartModel.findOne({
            user: req.user._id,
            product: item.product._id,
            status: "pending"
        });

        if (existingPending) {
            existingPending.quantity += item.quantity;
            await existingPending.save();
            await cartModel.findByIdAndDelete(item._id);
        } else {
            item.status = "pending";
            await item.save();
        }
        sendEmail(item.product.user.email,"New Order","You have new order RSVP")
    }

    res.status(200).json({
        status: "success",
        message: "Checkout successful! Items merged or moved to pending.",
    });
});

// remove item from cart

export const removeCartItem = asyncHandler(async (req, res, next) => {
    let { id } = req.params;

    const item = await cartModel.findOneAndDelete({
        _id: id,
        user: req.user._id,
        status: "not-confirmed",
    });

    if (!item) {
        return next(new appError("Item not found or cannot be deleted", 404));
    }

    res.status(200).json({
        message: "success, item removed",
    });
});
// clear user's cart

export const clearCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    await cartModel.deleteMany({
        user: userId,
        status: "not-confirmed",
    });

    res.status(204).json({
        message: "success , Cart cleared",
    });
});
