import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";
import { ORDER_STATUSES } from "../utils/constants.js";

// POST /api/orders  body: { items: [{ productId, quantity }], shippingAddress }
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || items.length === 0) throw httpError(400, "Your cart is empty");

  const required = ["fullName", "email", "phone", "address", "city", "postalCode"];
  const missing = required.filter((f) => !shippingAddress?.[f]?.toString().trim());
  if (missing.length) throw httpError(400, `Missing shipping fields: ${missing.join(", ")}`);

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!mongoose.isValidObjectId(item.productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw httpError(400, "Invalid cart item");
    }
    // Price always comes from the database, never from the client.
    const product = await Product.findById(item.productId);
    if (!product) throw httpError(404, "A product in your cart no longer exists");
    if (product.stock < quantity) throw httpError(400, `Only ${product.stock} left of ${product.name}`);

    orderItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, quantity });
    totalAmount += product.price * quantity;
  }

  // Reduce stock atomically; roll back if any item ran out meanwhile.
  const reduced = [];
  for (const it of orderItems) {
    const ok = await Product.updateOne({ _id: it.product, stock: { $gte: it.quantity } }, { $inc: { stock: -it.quantity } });
    if (ok.modifiedCount === 0) {
      for (const r of reduced) await Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } });
      throw httpError(400, `${it.name} just went out of stock`);
    }
    reduced.push(it);
  }

  const order = await Order.create({
    user: req.user._id,
    products: orderItems,
    shippingAddress,
    totalAmount: Math.round(totalAmount * 100) / 100,
    paymentMethod: "Cash on Delivery",
  });
  res.status(201).json(order);
});

// GET /api/orders/my-orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders (admin)  ?status=
export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id/status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) throw httpError(400, "Invalid status");

  const order = await Order.findById(req.params.id);
  if (!order) throw httpError(404, "Order not found");

  // Return stock when an order is cancelled (only once).
  if (status === "Cancelled" && order.status !== "Cancelled") {
    for (const it of order.products) await Product.updateOne({ _id: it.product }, { $inc: { stock: it.quantity } });
  }
  order.status = status;
  await order.save();
  await order.populate("user", "name email");
  res.json(order);
});
