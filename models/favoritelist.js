import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Favorite must belong to a user']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: [true, 'Favorite must have a product']
    }
});
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });
const Favorite = mongoose.model('favorites', favoriteSchema);
export default Favorite;