import express from "express";
import {
    addComment,
    getProductComments,
    updateComment,
    deleteComment,
} from "../controllers/commentController.js";
import { auth } from "../middleware/authMiddleware.js";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.get("/", getProductComments);
commentRouter.post("/", auth, addComment);
commentRouter.patch("/:id", auth, updateComment);
commentRouter.delete("/:id", auth, deleteComment);

export { commentRouter };
