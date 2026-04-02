import asyncHandler from 'express-async-handler';
import Product from "../models/productBase.js";
import Laptop from "../models/laptop.js";
import Mobile from "../models/mobile.js";
import Headphone from "../models/headPhone.js";
import { appError } from "../utils/appError.js";

const categoryModels = {
    'Laptop': Laptop,
    'mobiles': Mobile,
    'headphone': Headphone,
};

// Create product 
//  POST /api/products

export const createProduct = asyncHandler(async (req, res, next) => {
    const { Type } = req.body;
    const Model = categoryModels[Type];
    const imageUrl = req.file.path
    console.log(imageUrl)
    if (!Model) {
        return next(new appError("Invalid category. Choose: Laptop | mobiles | headphone", 400));
    }

    const product = await Model.create({ ...req.body, user: req.user._id,img:imageUrl });
    res.status(201).json({ status: "success", data: product });
});

// Get all products 
// GET /api/products
export const getAllProducts = asyncHandler(async (req, res, next) => {
    const { category, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (category) {
        const typeMap = { laptop: "Laptop", mobiles: "mobiles", headphone: "headphone" };
        const typeValue = typeMap[category.toLowerCase()];
        if (!typeValue) return next(new appError("Invalid category", 400));
        filter.Type = typeValue;
    }

    if (search) {
        filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
        Product.find(filter).skip(skip).limit(Number(limit)),
        Product.countDocuments(filter),
    ]);     

    res.status(200).json({
        status: "success",
        results: products.length,
        total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        data: products,
    });
});

// Get one product 
// GET /api/products/:id

export const getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("users", "name email");
    if (!product) return next(new appError("Product not found", 404));
    res.status(200).json({ status: "success", data: product });
});

// Update product 
//  PATCH /api/products/:id

export const updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new appError("Product not found", 404));

    if (product.user.toString() !== req.user._id.toString()) {
        return next(new appError("You are not allowed to update this product", 403));
    }

    const Model = categoryModels[product.Type] || Product;
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ status: "success", data: updated });
});

// Delete product 
// DELETE /api/products/:id

export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new appError("Product not found", 404));

    if (product.user.toString() !== req.user._id.toString()) {
        return next(new appError("You are not allowed to delete this product", 403));
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
});
