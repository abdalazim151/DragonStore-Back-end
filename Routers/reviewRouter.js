import express from "express";
import {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
} from "../controllers/reviewController.js";
import { auth } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.get("/", getProductReviews);
reviewRouter.post("/", auth, addReview);
reviewRouter.patch("/:id", auth, updateReview);
reviewRouter.delete("/:id", auth, deleteReview);

export { reviewRouter };
