
import express, { Router } from "express"
import {addAddress, fetchAddress, editAddress, deleteAddress} from "../../controllers/shop/address-controller.js"; 

const addressRouter = Router();

addressRouter.post("/add", addAddress);
addressRouter.get("/get/:userId", fetchAddress);
addressRouter.delete("/delete/:userId/:addressId", deleteAddress);
addressRouter.put("/update/:userId/:addressId", editAddress);

export default addressRouter;
