import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
  ref: 'Product', // Correct reference name to match Product model registration
      required: true,
      index: true, // Faster queries
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    reviewMessage: {
      type: String,
      required: true,
      trim: true,
    },
    reviewValue: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    images: [
      {
        type: String, // Image URLs
      },
    ],
    isApproved: {
      type: Boolean,
      default: true, // Auto-approved
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt fields
  }
);

// 🔍 Indexes for performance optimization
ReviewSchema.index({ productId: 1, userId: 1 });
ReviewSchema.index({ productId: 1, isApproved: 1, isVisible: 1 });

// ✅ Export model (ES module style)
const ReviewModel = mongoose.model('Review', ReviewSchema);
export default ReviewModel;
