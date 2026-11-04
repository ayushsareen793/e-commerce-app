import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

const refreshProductRating = async (productId) => {
  const [stats] = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(productId, {
    averageRating: stats ? Math.round(stats.avg * 10) / 10 : 0,
    numReviews: stats ? stats.count : 0,
  });
};

// POST /api/reviews/:productId
export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const rating = Number(req.body.rating);
  const comment = (req.body.comment || "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw httpError(400, "Rating must be 1 to 5");
  if (comment.length < 3) throw httpError(400, "Please write a short comment");

  const product = await Product.findById(productId);
  if (!product) throw httpError(404, "Product not found");

  const already = await Review.findOne({ user: req.user._id, product: productId });
  if (already) throw httpError(409, "You have already reviewed this product");

  const review = await Review.create({ user: req.user._id, product: productId, rating, comment });
  await refreshProductRating(productId);
  await review.populate("user", "name");
  res.status(201).json(review);
});

// GET /api/reviews/:productId
export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate("user", "name").sort({ createdAt: -1 });
  res.json(reviews);
});
