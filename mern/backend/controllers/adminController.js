import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, totalCustomers, sales] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.aggregate([{ $match: { status: { $ne: "Cancelled" } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
  ]);
  const recentOrders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5);
  res.json({ totalProducts, totalOrders, totalCustomers, totalSales: sales[0]?.total || 0, recentOrders });
});
