import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  createBookingPayment,
  fetchBookingPaymentSummary,
  handlePaystackWebhook,
  verifyPayment,
  fetchUserPayments,
} from "./payment.controller.js";

const router = express.Router();

router.post("/webhook/paystack", handlePaystackWebhook);

router.use(authMiddleware, roleMiddleware(ROLES.USER));
router.get("/", fetchUserPayments);
router.get("/booking/:bookingId", fetchBookingPaymentSummary);
router.post("/booking/:bookingId/initiate", createBookingPayment);
router.get("/verify/:reference", verifyPayment);

export default router;
