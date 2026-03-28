import mongoose from "mongoose";
import Product from "./productBase.js";
const MobileSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Mobile brand is required'],
        trim: true
    },
    modelName: {
        type: String,
        required: [true, 'Model name is required']
    },
    specifications: {
        storage: {
            type: String,
            enum: ['64GB', '128GB', '256GB', '512GB', '1TB'],
            required: true
        },
        ram: {
            type: String,
            enum: ['4GB', '6GB', '8GB', '12GB', '16GB'],
            required: true
        },
        screenSize: String,
        battery: String,
        processor: String,
        camera: String 
    },
    is5G: {
        type: Boolean,
        default: false
    },
});
const Mobile = Product.discriminator('mobiles', MobileSchema);

export default Mobile;