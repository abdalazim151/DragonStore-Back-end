import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: [true, 'Comment must belong to a user']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: [true, 'Comment must belong to a product']
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', 
        default: null   
    }
}, { timestamps: true });

commentSchema.index({ product: 1 });
const Comment = mongoose.model('comment', commentSchema);
export default Comment;