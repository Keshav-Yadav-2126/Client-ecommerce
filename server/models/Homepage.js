import mongoose from "mongoose";

// Banner/Carousel Schema
const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    trim: true,
  },
  link: {
    type: String,
    default: "",
    trim: true,
  },
  buttonText: {
    type: String,
    default: "",
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { 
  timestamps: true 
});

// Discount Banner Schema
const DiscountBannerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  discountPercentage: Number,
  backgroundColor: {
    type: String,
    default: '#F59E0B',
  },
  textColor: {
    type: String,
    default: '#FFFFFF',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

// Featured Products Schema
const FeaturedProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Customer Review Schema
const CustomerReviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  customerImage: String,
  isApproved: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// About Us Schema
const AboutUsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Video Schema
const VideoSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Banner = mongoose.model("Banner", BannerSchema);
export const DiscountBanner = mongoose.model("DiscountBanner", DiscountBannerSchema);
export const FeaturedProduct = mongoose.model("FeaturedProduct", FeaturedProductSchema);
export const CustomerReview = mongoose.model("CustomerReview", CustomerReviewSchema);
export const AboutUs = mongoose.model("AboutUs", AboutUsSchema);
export const Video = mongoose.model("Video", VideoSchema);
