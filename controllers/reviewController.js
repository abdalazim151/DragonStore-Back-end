import asyncHandler from 'express-async-handler';
import Review from "../models/rate.js";
import Product from "../models/productBase.js";
import { appError } from "../utils/appError.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────
// ADD REVIEW  POST /api/products/:productId/reviews
// ─────────────────────────────────────────
export const addReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return next(new appError("You already reviewed this product", 400));

    const review = await Review.create({
        rating: req.body.rating,
        product: productId,
        user: req.user._id,
    });

    await updateProductRating(productId);

    res.status(201).json({ status: "success", data: review });
});

// ─────────────────────────────────────────
// GET ALL REVIEWS FOR A PRODUCT  GET /api/products/:productId/reviews
// ─────────────────────────────────────────
export const getProductReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ product: req.params.productId })
        .populate("user", "name email");

    res.status(200).json({ status: "success", results: reviews.length, data: reviews });
});

// ─────────────────────────────────────────
// UPDATE REVIEW  PATCH /api/products/:productId/reviews/:id
// ─────────────────────────────────────────
export const updateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new appError("Review not found", 404));

    if (review.user.toString() !== req.user._id.toString()) {
        return next(new appError("You can only update your own review", 403));
    }

    review.rating = req.body.rating ?? review.rating;
    await review.save();

    await updateProductRating(req.params.productId);

    res.status(200).json({ status: "success", data: review });
});

// ─────────────────────────────────────────
// DELETE REVIEW  DELETE /api/products/:productId/reviews/:id
// ─────────────────────────────────────────
export const deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new appError("Review not found", 404));

    if (review.user.toString() !== req.user._id.toString()) {
        return next(new appError("You can only delete your own review", 403));
    }

    await Review.findByIdAndDelete(req.params.id);
    await updateProductRating(req.params.productId);

    res.status(204).json({ status: "success", data: null });
});

// ─────────────────────────────────────────
// HELPER: recalculate and save product rating stats
// ─────────────────────────────────────────
const updateProductRating = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: "$product", ratingSum: { $sum: "$rating" }, ratingsQuantity: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingSum: stats[0].ratingSum,
            ratingsQuantity: stats[0].ratingsQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, { ratingSum: 0, ratingsQuantity: 0 });
    }
};

