import Product from "./productBase.js";
import mongoose from "mongoose";

const HeadphoneSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    type: {
        type: String,
        enum: ['Over-Ear', 'On-Ear', 'In-Ear (Earbuds)'],
        required: true
    },
    connectionType: {
        type: String,
        enum: ['Wired', 'Wireless', 'Hybrid'],
        default: 'Wireless'
    },
    batteryLife: String, 
    hasNoiseCancelling: { type: Boolean, default: false },
    microphone: { type: Boolean, default: true }
});

const Headphone = Product.discriminator('headphone', HeadphoneSchema);
export default Headphone;