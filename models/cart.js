import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: [true, 'Cart must belong to a user']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Cart must have a product']
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity cannot be less than 1']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }
},);
cartSchema.index({ user: 1, product: 1, status: 1 }, { unique: true });
const Cart = mongoose.model('cart', cartSchema);
export default Cart;