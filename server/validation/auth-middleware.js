import { verifyToken } from "../utils/token.js";

export const protectedRoutes = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded instanceof Error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // attach decoded data
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};
