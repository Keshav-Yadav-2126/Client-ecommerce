import express, { Router } from "express";
import { 
  createOrder, 
  verifyPayment, 
  getAllOrdersByUser, 
  getOrderDetails,
  refundOrder
} from "../../controllers/shop/order-controller.js"; 

const orderRouter = Router();

orderRouter.post("/create", createOrder);
orderRouter.post("/verify", verifyPayment);
orderRouter.get("/list/:userId", getAllOrdersByUser);
orderRouter.get("/details/:id", getOrderDetails);
orderRouter.post("/refund/:orderId", refundOrder);

export default orderRouter;