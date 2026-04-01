import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartQty,
  payCart,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Add product to cart
router.post("/add", auth, addToCart);

//  Get user cart
router.get("/", auth, getUserCart);

// Update quantity
router.patch("/update/:id", auth, updateCartQty);

//  Checkout (Pay)
router.patch("/checkout", auth, payCart);

//  Remove item
router.delete("/remove/:id", auth, removeCartItem);

// Clear cart
router.delete("/clear", auth, clearCart);

export default router;
