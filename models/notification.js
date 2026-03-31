import mongoose from "mongoose";
const notificationSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'notification must belong to a user']
    },
    content:{
        type:String,
        required:true
    }
}, { timestamps: true });
notificationSchema.index({ to: 1 });
const Notification=mongoose.model("notifications",notificationSchema)
export default Notification