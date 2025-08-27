import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimit.js";

import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import externalRoutes from "./routes/external.routes.js";
import supportRoutes from "./routes/support.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// DB
connectDB();

// Global middlewares
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/external", externalRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

export default app;
