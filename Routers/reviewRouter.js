import express from "express";
import {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
} from "../controllers/reviewController.js";
import { auth, allowedTo } from "../middleware/authMiddleware.js";

// mergeParams lets us access :productId from the parent productRouter
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
    .route("/:id")
    .get(getProductReviews)       // GET  /api/products/:productId/reviews

reviewRouter
    .route("/:id")
    .post(auth, addReview)    // POST /api/products/:productId/reviews
     .patch(auth, updateReview)    // PATCH  /api/products/:productId/reviews/:id
      .delete(auth, deleteReview); // DELETE /api/products/:productId/reviews/:id

export { reviewRouter };
