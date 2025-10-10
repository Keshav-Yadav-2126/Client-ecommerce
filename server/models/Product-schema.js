//product-schema.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    image: String,
    images: [String], // Array for multiple product images
    title: String,
    description: String,
    category: String,
    price: Number,
    salePrice: Number,
    stock: Number,
    size: String, // Size in ml or other units
    ingredients: [String], // Array of ingredients
    keyBenefits: [String], // Array of key benefits
    averageReview: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;