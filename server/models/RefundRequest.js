import mongoose from "mongoose";

const RefundRequestSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productImage: { type: String, required: true }, // URL or path to uploaded image
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  adminComment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const RefundRequest = mongoose.model("RefundRequest", RefundRequestSchema);

export default RefundRequest;
