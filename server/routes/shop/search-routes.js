
import express, { Router } from "express";

import searchProducts from "../../controllers/shop/search-controller.js";

const searchRouter = Router();

searchRouter.get("/:keyword", searchProducts);

export default searchRouter;
