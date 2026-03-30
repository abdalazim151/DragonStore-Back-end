import Product from "./productBase.js";
import mongoose from "mongoose";

const LaptopSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    processor: { type: String, required: true },
    ram: {
        type: Number,
        required: true,
        enum: [8, 16, 32, 64] 
    },
    storage: {
        size: { type: Number, required: true },
        type: { type: String, enum: ['SSD', 'HDD'], default: 'SSD' }
    },
    gpu: String,
    screenSize: Number,
    os: { type: String, default: 'Windows 11' }
});

const Laptop = Product.discriminator('Laptop', LaptopSchema);
export default Laptop;