import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth/auth-routes.js';
import featureRouter from './routes/common/feature-routes.js';
import adminProductRouter from './routes/admin/products-routes.js';
import adminOrderRouter from './routes/admin/order-routes.js';
import homepageRouter from './routes/admin/homepage-routes.js';
import shopProductRouter from './routes/shop/products-routes.js';
import shopCartRouter from './routes/shop/cart-routes.js';
import addressRouter from './routes/shop/address-routes.js';
import orderRouter from "./routes/shop/order-routes.js";
import searchRouter from "./routes/shop/search-routes.js";
import refundRouter from "./routes/shop/refund-routes.js";
import reviewRouter from './routes/shop/review-routes.js';
import shopCartrouter from './routes/shop/cart-routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_BASE_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Make io accessible to routes
app.set('io', io);

app.use(cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

    socket.on('join-admin', () => {
        socket.join('admin-room');
        console.log('Admin joined admin-room');
    });

    socket.on('disconnect', () => {
        console.log('Admin disconnected:', socket.id);
    });
});

// Middleware to pass io to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Auth routes
app.use("/api/auth", router);

// Admin routes
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/homepage", homepageRouter);

// Shop routes
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", shopCartrouter);
app.use("/api/shop/address", addressRouter);
app.use("/api/shop/order", orderRouter);
app.use("/api/shop/search", searchRouter);
app.use("/api/shop/refund", refundRouter);
app.use("/api/shop/review", reviewRouter);

// Common routes
app.use("/api/common/feature", featureRouter);

const PORT = process.env.PORT || 5000;

const promise = connectDB();
promise.then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Socket.IO initialized`);
    });
}).catch((error) => {
    console.error("Database connection failed:", error);
});

export default app;
export { io };