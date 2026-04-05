import asyncHandler from 'express-async-handler';
import Cart from "../models/cart.js"
import { sendEmail } from '../services/emailService.js';
import { appError } from '../utils/appError.js';
export const Get = asyncHandler(async (req, res, next) => {
    let id=req.user._id
    const items = await Cart.find({
        status: "pending",
    }).populate({
        path: "product",
        match: { user: id },
        select: "title price user img"
    });
    return res.json(items)
})
export const Response = asyncHandler(async (req, res, next) => {
    const vendorId = req.user._id;
    const { id, response } = req.params;
    const isAccepted = response === 'true';
    const isRejected = response === 'false';
    if (!isAccepted && !isRejected) {
        return next(new appError("Response must be true or false", 400));
    }
    const item = await Cart.findOne({
        _id: id,
        status: "pending"
    }).populate("product").populate("user", "email name");
    if (!item) {
        return next(new appError("Order not found or already processed", 404));
    }
    
    if (item.product.user.toString() !== vendorId.toString()) {
        return next(new appError("You are not authorized to respond to this order", 403));
    }
    item.status = isAccepted ? "accepted" : "rejected";
    await item.save();
    sendEmail(item.user.email, "Oreder Response Check it ", "Check Yor notification")
    res.status(200).json({
        status: "success",
        message: `Order has been ${item.status}`,
        customerEmail: item.user.email, // إيميل المشتري
        orderData: {
            user:item.user,
            product:{
                title:item.product.title,
                price:item.product.price,
                brand: item.product.brand
            }
        }
    });

});

 
