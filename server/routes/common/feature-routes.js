import express, { Router } from "express";

import {
  addFeatureImage,
  getFeatureImages,
} from "../../controllers/common/feature-controller.js";

const featureRouter = Router();

featureRouter.post("/add", addFeatureImage);
featureRouter.get("/get", getFeatureImages);

export default featureRouter;