import express from "express";
import {addToCart, fetchCartItems, updateCartItemQty, deleteCartItem} from "../../controllers/shop/cart-controller.js";

const shopCartrouter = express.Router();

shopCartrouter.post("/add", addToCart);
shopCartrouter.get("/get/:userId", fetchCartItems);
shopCartrouter.put("/update-cart", updateCartItemQty);
shopCartrouter.delete("/:userId/:productId", deleteCartItem);

export default shopCartrouter;