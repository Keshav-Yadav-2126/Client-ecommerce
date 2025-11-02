import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../../models/Order.js";
import Cart from "../../models/Cart-schema.js";
import ProductModel from "../../models/Product-schema.js";

// // Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
      customerName,    // ✅ ADDED
      customerEmail,   // ✅ ADDED (optional)
    } = req.body;

    console.log("Creating order with customer name:", customerName); // ✅ DEBUG LOG  

    // Validate stock before creating order
    for (let item of cartItems) {
      const product = await ProductModel.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}. Available: ${product.stock}`,
        });
      }
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
        cartId: cartId,
      },
    });

    // Create order in database
    const newlyCreatedOrder = new orderModel({
      userId,
      cartId,
      cartItems,
      addressInfo: {
        ...addressInfo,
        mobileNo: addressInfo.mobileNo || addressInfo.phone,  // ✅ Ensure mobileNo is saved
        phone: addressInfo.phone || addressInfo.mobileNo,     // ✅ Keep phone for backward compatibility
      },
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: razorpayOrder.id,
      payerId: "",
      customerName: customerName,      // ✅ ADDED
      customerEmail: customerEmail,    // ✅ ADDED
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      orderId: newlyCreatedOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.log("Create order error:", e);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: e.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find order
    let order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify stock again before confirming
    for (let item of order.cartItems) {
      let product = await ProductModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}. Available: ${product.stock}`,
        });
      }
    }

    // Update order status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = razorpay_payment_id;
    order.payerId = razorpay_order_id;

    // Update product stock
    for (let item of order.cartItems) {
      let product = await ProductModel.findById(item.productId);

      if (product) {
        product.stock -= item.quantity;
        
        if (product.stock < 0) {
          product.stock = 0;
        }

        await product.save();
        console.log(`Updated stock for ${product.title}: ${product.stock + item.quantity} -> ${product.stock}`);
      }
    }

    // Delete cart
    const getCartId = order.cartId;
    if (getCartId) {
      await Cart.findByIdAndDelete(getCartId);
      console.log(`Deleted cart: ${getCartId}`);
    }

    await order.save();

    // SOCKET.IO: Emit new order notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('new-order', {
        orderId: order._id,
        orderNumber: order._id.toString().slice(-8),
        totalAmount: order.totalAmount,
        customerName: order.addressInfo?.address || 'Customer',
        timestamp: new Date(),
      });
      console.log('New order notification sent to admin');
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  } catch (e) {
    console.log("Verify payment error:", e);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: e.message,
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await orderModel.find({ userId }).sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Refund order controller
const refundOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ success: false, message: "Order is not paid" });
    }
    if (order.orderStatus === "cancelled" || order.orderStatus === "refunded") {
      return res.status(400).json({ success: false, message: "Order already refunded or cancelled" });
    }
    // Mark order as refunded
    order.orderStatus = "refunded";
    order.paymentStatus = "refunded";
    order.orderUpdateDate = new Date();
    await order.save();
    return res.status(200).json({ success: true, message: "Order refunded successfully", data: order });
  } catch (error) {
    console.error("Refund error:", error);
    return res.status(500).json({ success: false, message: "Refund failed", error: error.message });
  }
};

export {
  createOrder,
  verifyPayment,
  getAllOrdersByUser,
  getOrderDetails,
  refundOrder,
};