// Usage: npm run make-admin -- you@example.com
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run make-admin -- <email>");
  process.exit(1);
}
await connectDB();
const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { role: "admin" }, { new: true });
console.log(user ? `${user.email} is now an admin` : "No user found with that email. Register first.");
await mongoose.disconnect();
