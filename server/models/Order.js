// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    state: String,        // ✅ ADDED
    pincode: String,
    phone: String,
    mobileNo: String,     // ✅ ADDED
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
  customerName: String,   // ✅ ADDED to store customer name
  customerEmail: String,  // ✅ ADDED (optional)
});

const orderModel = mongoose.model("Order", OrderSchema);

export default orderModel;