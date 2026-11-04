import Product from "../models/Product.js";
import Review from "../models/Review.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

// GET /api/products?search=&category=&sort=price_asc|price_desc|newest|rating
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { averageRating: -1 },
    newest: { createdAt: -1 },
  };
  const products = await Product.find(filter).sort(sortMap[sort] || { createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json(product);
});

const pickFields = (body) => {
  const { name, description, price, image, category, stock } = body;
  return { name, description, price, image, category, stock };
};

// POST /api/products (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pickFields(req.body));
  res.status(201).json(product);
});

// PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const updates = Object.fromEntries(Object.entries(pickFields(req.body)).filter(([, v]) => v !== undefined));
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!product) throw httpError(404, "Product not found");
  res.json(product);
});

// DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  await Review.deleteMany({ product: product._id });
  res.json({ message: "Product deleted" });
});
