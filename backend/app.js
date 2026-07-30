import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import helmet from "helmet";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import { notFoundMiddleware } from "./src/middleware/notFoundMiddleware.js";
import { apiLimiter } from "./src/middleware/rateLimitMiddleware.js";
import policyRoutes from "./src/modules/policies/policy.routes.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import vendorRoutes from "./src/modules/vendors/vendor.routes.js";
import eventRoutes from "./src/modules/events/event.routes.js";
import bookingRoutes from "./src/modules/bookings/booking.routes.js";
import paymentRoutes from "./src/modules/payments/payment.routes.js";
import messageRoutes from "./src/modules/messages/message.routes.js";
import notificationRoutes from "./src/modules/notifications/notification.routes.js";
import kycRoutes from "./src/modules/kyc/kyc.routes.js";
import subscriptionRoutes from "./src/modules/subscriptions/subscription.routes.js";
import adminRoutes from "./src/modules/admin/admin.routes.js";
import supportRoutes from "./src/modules/support/support.routes.js";
import disputeRoutes from "./src/modules/disputes/dispute.routes.js";


dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "http://localhost:5173",
  "https://eventsure-dami.vercel.app",
;)

  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({
  limit: "1mb",
  verify(req, _res, buffer) {
    req.rawBody = buffer;
  },
}));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", apiLimiter);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "EventSure API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "EventSure API is healthy",
    data: {
      status: "ok",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/disputes", disputeRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;



