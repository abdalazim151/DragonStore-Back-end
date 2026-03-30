import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Rating must be between 1 and 5']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    }
}, { timestamps: true });

rateSchema.index({ product: 1, user: 1 }, { unique: true });
const Review = mongoose.model('rates', rateSchema);
// const Review = mongoose.model('rates', reviewSchema);

export default Review;