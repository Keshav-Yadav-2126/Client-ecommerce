import express from "express";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "../../controllers/admin/order-controller.js";

const adminOrderRouter = express.Router();

adminOrderRouter.get("/get", getAllOrdersForAdmin);
adminOrderRouter.get("/details/:id", getOrderDetailsForAdmin);
adminOrderRouter.put("/update/:id", updateOrderStatus);

export default adminOrderRouter;