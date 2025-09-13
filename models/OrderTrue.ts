/* import { Types } from "mongoose"; */

export interface CustomerInfo {
  name: string;
  email: string;
  address?: string;
}

export interface OrderTrue {
  _id: string;
  product: string; // Can be ObjectId or populated ProductTrue
  quantity: number;
  status: "pending" | "validated" | "cancelled";
  totalAmount: number;
  customerInfo: CustomerInfo;
  createdAt: Date;
  updatedAt: Date;
}

// For document creation (without auto-generated fields)
export interface CreateOrderDto {
  product: string;
  quantity: number;
  status?: "pending" | "validated" | "cancelled"; // Optional with default
  totalAmount: number;
  customerInfo: CustomerInfo;
}

// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductTrue",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "validated", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    customerInfo: {
      name: String,
      email: String,
      address: String,
    },
  },
  {
    timestamps: true,
  }
);

const OrderTrue =
  mongoose.models.OrderTrue || mongoose.model("OrderTrue", orderSchema);
export default OrderTrue;
