// Seeds MongoDB with sample products. Usage: npm run seed
import "dotenv/config";
import { readFile } from "node:fs/promises";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

const products = JSON.parse(await readFile(new URL("./products.json", import.meta.url), "utf8"));

try {
  await connectDB();
  await Review.deleteMany({});
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
} catch (err) {
  console.error("Seed failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
