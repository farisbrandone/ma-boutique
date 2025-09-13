import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductTrue",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
export default Sale;
