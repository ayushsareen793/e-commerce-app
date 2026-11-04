import mongoose from "mongoose";
import { ORDER_STATUSES } from "../utils/constants.js";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [orderItemSchema], validate: [(v) => v.length > 0, "Order has no items"] },
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash on Delivery"], default: "Cash on Delivery" },
    status: { type: String, enum: ORDER_STATUSES, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
