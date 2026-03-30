import express from "express";
import upload from "../services/cloudinary.js"; 

import {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { auth, allowedTo } from "../middleware/authMiddleware.js";
import { reviewRouter } from "./reviewRouter.js";
import { commentRouter } from "./commentRouter.js";

const productRouter = express.Router();

// Nest review and comment routes under a product
productRouter.use("/:productId/reviews", reviewRouter);
productRouter.use("/:productId/comments", commentRouter);

productRouter
    .route("/")
    .get(getAllProducts)          // public – GET /api/products
//   .post(auth, allowedTo('admin', 'seller'), createProduct);// auth required – POST /api/products
     .post(auth,upload.single('img'), createProduct);
productRouter
    .route("/:id")
    .get(getProduct)                    // public
       .patch(auth, allowedTo('admin', 'seller'),upload.single('img'), updateProduct)    // auth required
    .delete(auth, allowedTo('admin', 'seller'), deleteProduct);   // auth required

export default productRouter;
