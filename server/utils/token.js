import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (userId, userRole, userEmail, userName) => {
  return jwt.sign({ id: userId, role: userRole, email: userEmail, name: userName }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    return error;
  }
}