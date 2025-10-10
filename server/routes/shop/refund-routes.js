import express from "express";
import {
  createRefundRequest,
  updateRefundStatus,
  getAllRefundRequests,
  getUserRefundRequests
} from "../../controllers/shop/refund-controller.js";
import { upload } from "../../helpers/cloudinary.js";

const refundRouter = express.Router();

// User creates refund request (with image upload)
refundRouter.post("/create", upload.single("productImage"), createRefundRequest);
// Admin updates refund status
refundRouter.put("/update/:id", updateRefundStatus);
// Admin gets all refund requests
refundRouter.get("/all", getAllRefundRequests);
// User gets their refund requests
refundRouter.get("/user/:userId", getUserRefundRequests);

export default refundRouter;
