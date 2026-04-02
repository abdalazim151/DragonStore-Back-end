import express from "express";
import {
    addComment,
    getProductComments,
    updateComment,
    deleteComment,
} from "../controllers/commentController.js";
import { auth, allowedTo } from "../middleware/authMiddleware.js";

const commentRouter = express.Router({ mergeParams: true });

commentRouter
    .route("/:id")
    .get(getProductComments)       // GET  /api/products/:productId/comments
    .post(auth, addComment)
    .patch(auth, updateComment)   // PATCH  /api/products/:productId/comments/:id
    .delete(auth, deleteComment);  // DELETE /api/products/:productId/comments/:id

export { commentRouter };
