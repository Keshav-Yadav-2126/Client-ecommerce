import User from "../../models/User-schema.js";
import RefundRequest from "../../models/RefundRequest.js";
import orderModel from "../../models/Order.js";
// import User from "../../models/User.js";
import { handleUploadImage } from "../../helpers/cloudinary.js";

// User requests refund (with image upload)
export const createRefundRequest = async (req, res) => {
  try {
    const { orderId, reason, userId } = req.body;
    
    if (!orderId || !reason || !req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (orderId, reason, or image)" 
      });
    }

    // Check if order exists and is paid
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ 
        success: false, 
        message: "Only paid orders can be refunded" 
      });
    }

    // Check if refund request already exists
    const existing = await RefundRequest.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: "Refund request already exists for this order" 
      });
    }

    // Upload image to Cloudinary
    const fileBuffer = req.file.buffer;
    const fileBase64 = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
    const uploadResult = await handleUploadImage(fileBase64);
    const productImage = uploadResult.secure_url;

    // Create refund request
    const refund = new RefundRequest({ 
      orderId, 
      userId: userId || order.userId, 
      reason, 
      productImage 
    });
    
    await refund.save();

    return res.status(201).json({ 
      success: true, 
      message: "Refund request submitted successfully", 
      data: refund 
    });
  } catch (error) {
    console.error("Refund request error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin approves/rejects refund
export const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status. Must be 'approved' or 'rejected'" 
      });
    }

    const refund = await RefundRequest.findById(id);
    if (!refund) {
      return res.status(404).json({ 
        success: false, 
        message: "Refund request not found" 
      });
    }

    refund.status = status;
    refund.adminComment = adminComment || "";
    refund.updatedAt = new Date();
    await refund.save();

    // If approved, update order status to refunded
    if (status === "approved") {
      await orderModel.findByIdAndUpdate(refund.orderId, { 
        orderStatus: "refunded",
        orderUpdateDate: new Date()
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Refund ${status} successfully`, 
      data: refund 
    });
  } catch (error) {
    console.error("Update refund error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get all refund requests (admin) - with population
export const getAllRefundRequests = async (req, res) => {
  try {
    const refunds = await RefundRequest.find()
      .populate('userId', 'name email userName')
      .populate('orderId', '_id totalAmount orderDate')
      .sort({ createdAt: -1 });

    // Transform data for frontend
    const transformedRefunds = refunds.map(refund => ({
      _id: refund._id,
      orderId: refund.orderId?._id || refund.orderId,
      user: {
        name: refund.userId?.userName || refund.userId?.name || 'Unknown',
        email: refund.userId?.email || 'N/A'
      },
      amount: refund.orderId?.totalAmount || 0,
      reason: refund.reason,
      productImage: refund.productImage,
      status: refund.status,
      adminComment: refund.adminComment,
      createdAt: refund.createdAt,
      updatedAt: refund.updatedAt,
      processedDate: refund.status !== 'pending' ? refund.updatedAt : null
    }));

    return res.status(200).json({ 
      success: true, 
      data: transformedRefunds 
    });
  } catch (error) {
    console.error("Get refunds error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get refund requests for user
export const getUserRefundRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const refunds = await RefundRequest.find({ userId })
      .populate('orderId', '_id totalAmount orderDate')
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      data: refunds 
    });
  } catch (error) {
    console.error("Get user refunds error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};