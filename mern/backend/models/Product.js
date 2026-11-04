import mongoose from "mongoose";
import { CATEGORIES } from "../utils/constants.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    image: { type: String, required: [true, "Image URL is required"] },
    category: { type: String, required: true, enum: CATEGORIES },
    stock: { type: Number, required: true, min: 0, default: 0 },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
