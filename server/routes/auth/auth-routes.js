// auth-routes.js
import { Router } from "express";
import { 
  checkAuth, 
  login, 
  register, 
  forgotPassword, 
  resetPassword 
} from "../../controllers/auth/auth-controller.js";
import { protectedRoutes } from "../../validation/auth-middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/check-auth", protectedRoutes, checkAuth);

export default router;