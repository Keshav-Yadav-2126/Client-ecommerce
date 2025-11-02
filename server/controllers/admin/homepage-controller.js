// controllers/admin/homepage-controller.js
import {
  Banner,
  DiscountBanner,
  FeaturedProduct,
  CustomerReview,
  AboutUs,
  Video,
} from "../../models/Homepage.js";
import Product from "../../models/Product-schema.js";
import { handleUploadImage, handleUploadVideo, upload } from "../../helpers/cloudinary.js";

// ===== BANNER MANAGEMENT =====
export const addBanner = async (req, res) => {
  try {
    console.log("=== Add Banner Request ===");
    console.log("Request body:", req.body);
    
    const { title, description, image, link, buttonText, order } = req.body;

    // Validation - only image is required
    if (!image || !image.trim()) {
      console.error("❌ Missing image");
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    console.log("✅ Creating banner with data:", {
      title: title || "N/A",
      description: description || "N/A",
      image: image.substring(0, 50) + "...",
      link: link || "N/A",
      buttonText: buttonText || "N/A",
      order: order || 0,
    });

    const banner = new Banner({
      title: title ? title.trim() : "",
      description: description ? description.trim() : "",
      image: image.trim(),
      link: link ? link.trim() : "",
      buttonText: buttonText ? buttonText.trim() : "",
      order: parseInt(order) || 0,
      isActive: true,
    });

    await banner.save();
    
    console.log("✅ Banner saved successfully:", banner._id);

    res.status(201).json({
      success: true,
      message: "Banner added successfully",
      data: banner,
    });
  } catch (error) {
    console.error("❌ === Add Banner Error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
      return res.status(400).json({
        success: false,
        message: "Validation failed: " + Object.values(error.errors).map(e => e.message).join(", "),
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error adding banner: " + error.message,
    });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("Get banners error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching banners",
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const banner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    console.error("Update banner error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating banner",
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete banner error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting banner",
    });
  }
};

// ===== DISCOUNT BANNER MANAGEMENT =====
export const addDiscountBanner = async (req, res) => {
  try {
    const {
      text,
      discountPercentage,
      backgroundColor,
      textColor,
      startDate,
      endDate,
    } = req.body;

    // Deactivate all other discount banners
    await DiscountBanner.updateMany({}, { isActive: false });

    const discountBanner = new DiscountBanner({
      text,
      discountPercentage,
      backgroundColor,
      textColor,
      startDate,
      endDate,
      isActive: true,
    });

    await discountBanner.save();

    res.status(201).json({
      success: true,
      message: "Discount banner added successfully",
      data: discountBanner,
    });
  } catch (error) {
    console.error("Add discount banner error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding discount banner",
    });
  }
};

export const getActiveDiscountBanner = async (req, res) => {
  try {
    const now = new Date();
    const discountBanner = await DiscountBanner.findOne({
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now }, endDate: { $gte: now } },
      ],
    });

    res.status(200).json({
      success: true,
      data: discountBanner,
    });
  } catch (error) {
    console.error("Get discount banner error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching discount banner",
    });
  }
};

export const toggleDiscountBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive) {
      await DiscountBanner.updateMany({}, { isActive: false });
    }

    const banner = await DiscountBanner.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Discount banner updated successfully",
      data: banner,
    });
  } catch (error) {
    console.error("Toggle discount banner error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling discount banner",
    });
  }
};

// ===== FEATURED PRODUCTS MANAGEMENT =====
export const addFeaturedProduct = async (req, res) => {
  try {
    const { productId, order } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingFeatured = await FeaturedProduct.findOne({ productId });
    if (existingFeatured) {
      return res.status(400).json({
        success: false,
        message: "Product is already featured",
      });
    }

    const featuredProduct = new FeaturedProduct({
      productId,
      order: order || 0,
    });

    await featuredProduct.save();

    res.status(201).json({
      success: true,
      message: "Product featured successfully",
      data: featuredProduct,
    });
  } catch (error) {
    console.error("Add featured product error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding featured product",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await FeaturedProduct.find({ isActive: true })
      .populate("productId")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: featuredProducts,
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured products",
    });
  }
};

export const removeFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const featuredProduct = await FeaturedProduct.findByIdAndDelete(id);

    if (!featuredProduct) {
      return res.status(404).json({
        success: false,
        message: "Featured product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Featured product removed successfully",
    });
  } catch (error) {
    console.error("Remove featured product error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing featured product",
    });
  }
};

// ===== ABOUT US MANAGEMENT =====
export const addOrUpdateAboutUs = async (req, res) => {
  try {
    const { content } = req.body;

    // Deactivate all existing about us entries
    await AboutUs.updateMany({}, { isActive: false });

    // Create new or update existing
    const aboutUs = new AboutUs({
      content,
      isActive: true,
    });

    await aboutUs.save();

    res.status(201).json({
      success: true,
      message: "About Us content saved successfully",
      data: aboutUs,
    });
  } catch (error) {
    console.error("Add/Update About Us error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving About Us content",
    });
  }
};

export const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne({ isActive: true });

    res.status(200).json({
      success: true,
      data: aboutUs,
    });
  } catch (error) {
    console.error("Get About Us error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching About Us content",
    });
  }
};

// ===== VIDEO MANAGEMENT =====
export const addVideo = async (req, res) => {
  try {
    const { videoUrl, thumbnailUrl, order } = req.body;

    // Validate URLs are provided
    if (!videoUrl || !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: "Video URL and thumbnail URL are required",
      });
    }

    // Validate URLs are valid Cloudinary URLs
    if (!videoUrl.includes("cloudinary") || !thumbnailUrl.includes("cloudinary")) {
      return res.status(400).json({
        success: false,
        message: "Invalid Cloudinary URLs",
      });
    }

    // Create video record
    const video = new Video({
      videoUrl,
      thumbnailUrl,
      order: order || 0,
      isActive: true,
    });

    await video.save();

    console.log("✅ Video saved to database:", video._id);

    res.status(201).json({
      success: true,
      message: "Video added successfully",
      data: video,
    });
  } catch (error) {
    console.error("❌ Add video error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding video: " + error.message,
    });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Get videos error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching videos",
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    console.log("✅ Video deleted:", id);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting video",
    });
  }
};

// ===== CUSTOMER REVIEWS MANAGEMENT =====
export const addReview = async (req, res) => {
  try {
    const { customerName, rating, review, productId, customerImage } = req.body;

    const reviewData = new CustomerReview({
      customerName,
      rating,
      review,
      productId,
      customerImage,
      isApproved: false,
    });

    await reviewData.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully. Awaiting approval.",
      data: reviewData,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await CustomerReview.find({})
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await CustomerReview.find({ isApproved: true })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching approved reviews"
    });
  }
};

export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await CustomerReview.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review approved successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

    const review = await CustomerReview.findByIdAndUpdate(
      id,
      { isVisible },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Review visibility updated",
      data: review,
    });
  } catch (error) {
    console.error("Toggle review visibility error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating review visibility",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await CustomerReview.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
    });
  }
};

export const rejectReview = async (req, res) => {
  const { id } = req.params;
  const review = await CustomerReview.findByIdAndUpdate(
    id,
    { isApproved: false },
    { new: true }
  );
  if (!review)
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  res
    .status(200)
    .json({ success: true, message: "Review rejected", data: review });
};
