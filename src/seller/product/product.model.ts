import mongoose from "mongoose";
import { ProductDoc , ProductModel } from "@mainshopapp/common";


const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [{ src: String }],
        default: []
    }
});

const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);

export { Product };