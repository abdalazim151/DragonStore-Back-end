import asyncHandler from 'express-async-handler';
import Comment from "../models/comment.js";
import { appError } from "../utils/appError.js";

// Add comment  
// POST /api/products/:productId/comments
// body: { content, parent? }  parent is optional (for replies)

export const addComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.create({
        content: req.body.content,
        product: req.params.productId,
        user: req.user._id,
        parent: req.body.parent || null,
    });

    res.status(201).json({ status: "success", data: comment });
});

// Get all comments for a product  
// GET /api/products/:productId/comments
// returns top-level comments with their replies nested

export const getProductComments = asyncHandler(async (req, res, next) => {
    const allComments = await Comment.find({ product: req.params.productId })
        .populate("user", "name email")
        .sort({ createdAt: 1 });

    const commentMap = {};
    const topLevel = [];

    allComments.forEach((c) => {
        commentMap[c._id.toString()] = { ...c.toObject(), replies: [] };
    });

    allComments.forEach((c) => {
        if (c.parent) {
            const parentId = c.parent.toString();
            if (commentMap[parentId]) {
                commentMap[parentId].replies.push(commentMap[c._id.toString()]);
            }
        } else {
            topLevel.push(commentMap[c._id.toString()]);
        }
    });

    res.status(200).json({ status: "success", results: topLevel.length, data: topLevel });
});

// update comment 
// PATCH /api/products/:productId/comments/:id

export const updateComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new appError("Comment not found", 404));

    if (comment.user.toString() !== req.user._id.toString()) {
        return next(new appError("You can only edit your own comment", 403));
    }

    comment.content = req.body.content ?? comment.content;
    await comment.save();

    res.status(200).json({ status: "success", data: comment });
});

// Delete comment 
// DELETE /api/products/:productId/comments/:id
// also deletes all replies to that comment

export const deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new appError("Comment not found", 404));

    if (comment.user.toString() !== req.user._id.toString()) {
        return next(new appError("You can only delete your own comment", 403));
    }

    await Comment.deleteMany({ $or: [{ _id: req.params.id }, { parent: req.params.id }] });

    res.status(204).json({ status: "success", data: null });
});

