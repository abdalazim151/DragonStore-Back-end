import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Favorite must belong to a user"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: [true, "Favorite must have a product"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["not-confirmed", "pending", "accepted", "rejected"],
    default: "not-confirmed",
  },
});
cartSchema.index({ user: 1, product: 1, status: 1 }, { unique: true });
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
