import mongoose from "mongoose";

const cart = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'cart item must belong to a user']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: [true, 'cart item must have a product']
    },
    quantity:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['not-confirmed','pending','accepted','rejected'],
        default:'not-confirmed'
    }
});
cart.index({ user: 1, product: 1, status:1 });
const Cart = mongoose.model('carts', cart);
export default Cart;







