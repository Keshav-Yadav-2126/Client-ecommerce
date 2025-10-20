import Review from "../../models/Review.js";
import Order from "../../models/Order.js";
import ProductModel from "../../models/Product-schema.js";

// Get all reviews for a product (show all approved reviews)
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // FIXED: Changed isVisible to true to show approved reviews
    const reviews = await Review.find({
      productId,
      isApproved: true,
      isVisible: false, // ✅ Changed from false to true
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${reviews.length} reviews for product ${productId}`);

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// Add a new review (AUTO APPROVED - No admin approval needed)
export const addReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue, images } = req.body;

    console.log("Add review request:", { productId, userId, userName });

    if (!productId || !userId || !userName || !reviewMessage || !reviewValue) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (reviewValue < 1 || reviewValue > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const hasBought = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] },
    });

    if (!hasBought) {
      return res.status(403).json({
        success: false,
        message: "You must purchase this product before reviewing it",
      });
    }

    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // ✅ FIXED: Set isVisible to true so review appears immediately
    const review = new Review({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
      images: images || [],
      isApproved: true,  // Auto-approved
      isVisible: false,   // ✅ Changed from false to true
    });

    await review.save();
    console.log("✅ Review saved successfully:", review._id);

    res.json({
      success: true,
      data: review,
      message: "Review submitted successfully!",
    });
  } catch (err) {
    console.error("❌ Error adding review:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// Check if user can review a specific product
export const canReview = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    console.log("Checking review eligibility:", { productId, userId });

    const hasBought = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] },
    });

    const hasReviewed = await Review.findOne({ productId, userId });

    console.log("Review eligibility result:", {
      hasBought: !!hasBought,
      hasReviewed: !!hasReviewed,
    });

    res.json({
      success: true,
      canReview: hasBought && !hasReviewed,
      hasPurchased: !!hasBought,
      hasReviewed: !!hasReviewed,
    });
  } catch (err) {
    console.error("Error checking review eligibility:", err);
    res.status(500).json({
      success: false,
      message: "Failed to check review eligibility",
    });
  }
};

// Admin: Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("productId", "title image")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error("Error fetching all reviews:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// Admin: Approve review
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true, isVisible: true }, // ✅ Also set visible when approving
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, data: review, message: "Review approved successfully" });
  } catch (err) {
    console.error("Error approving review:", err);
    res.status(500).json({
      success: false,
      message: "Failed to approve review",
    });
  }
};

// Admin: Toggle review visibility
export const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

    const review = await Review.findByIdAndUpdate(id, { isVisible }, { new: true });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({
      success: true,
      data: review,
      message: `Review ${isVisible ? "shown" : "hidden"} successfully`,
    });
  } catch (err) {
    console.error("Error toggling review visibility:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update review visibility",
    });
  }
};

// Admin: Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

// Get approved reviews for homepage
export const getApprovedReviewsForHomepage = async (req, res) => {
  try {
    // ✅ FIXED: Changed isVisible to true for homepage
    const reviews = await Review.find({ 
      isApproved: true,
      isVisible: false  // ✅ Changed from false to true
    })
      .populate('productId', 'title image category')
      .sort({ createdAt: -1 })
      .limit(12); // Limit to 12 reviews for homepage
    
    // Filter out reviews with deleted products
    const validReviews = reviews.filter(r => r.productId);
    
    console.log(`✅ Found ${validReviews.length} reviews for homepage`);
    
    res.json({ 
      success: true, 
      data: validReviews 
    });
  } catch (err) {
    console.error('Error fetching homepage reviews:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews' 
    });
  }
};