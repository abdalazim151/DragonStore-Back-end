import mongoose from "mongoose";

const baseOptions = {
    discriminatorKey: 'Type',
    collection: 'products',       
    timestamps: true
};
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    ratingSum: {
        type: Number,
        default: 0,
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',                         
        required: [true, 'Product must belong to a user']
    },
    img:{
        type :String,
    }
}, baseOptions);
ProductSchema.index({ title: 'text', price: 1 });
const Product = mongoose.model('products', ProductSchema);
export default Product;