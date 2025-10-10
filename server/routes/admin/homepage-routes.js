import express from "express";
import {
  // Banners
  addBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
  // Discount Banner
  addDiscountBanner,
  getActiveDiscountBanner,
  toggleDiscountBanner,
  // Featured Products
  addFeaturedProduct,
  getFeaturedProducts,
  removeFeaturedProduct,
  // About Us
  addOrUpdateAboutUs,
  getAboutUs,
  // Reviews
  addReview,
  getAllReviews,
  getApprovedReviews,
  approveReview,
  toggleReviewVisibility,
  deleteReview,
  rejectReview,
} from "../../controllers/admin/homepage-controller.js";

const homepageRouter = express.Router();

// Banner routes
homepageRouter.post("/banner/add", addBanner);
homepageRouter.get("/banner/get", getAllBanners);
homepageRouter.put("/banner/update/:id", updateBanner);
homepageRouter.delete("/banner/delete/:id", deleteBanner);

// Discount banner routes
homepageRouter.post("/discount/add", addDiscountBanner);
homepageRouter.get("/discount/get", getActiveDiscountBanner);
homepageRouter.put("/discount/toggle/:id", toggleDiscountBanner);

// Featured products routes
homepageRouter.post("/featured/add", addFeaturedProduct);
homepageRouter.get("/featured/get", getFeaturedProducts);
homepageRouter.delete("/featured/remove/:id", removeFeaturedProduct);

// About Us routes
homepageRouter.post("/about/save", addOrUpdateAboutUs);
homepageRouter.get("/about/get", getAboutUs);

// Review routes
homepageRouter.post("/review/add", addReview);
homepageRouter.get("/review/all", getAllReviews);
homepageRouter.get("/review/approved", getApprovedReviews);
homepageRouter.put("/review/approve/:id", approveReview);
homepageRouter.put("/review/toggle/:id", toggleReviewVisibility);
homepageRouter.delete("/review/delete/:id", deleteReview);
homepageRouter.put("/review/reject/:id", rejectReview);


export default homepageRouter;