import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  fetchActiveBookings,
  fetchBookingDetails,
  fetchBookingOffer,
  fetchCompletedBookings,
  updateBookingOffer,
  createBooking,
  cancelBooking,
  fetchOffers,
} from "./booking.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware(ROLES.USER));

router.post("/", createBooking);
router.get("/active", fetchActiveBookings);
router.get("/completed", fetchCompletedBookings);
router.get("/offers", fetchOffers);
router.get("/:bookingId", fetchBookingDetails);
router.get("/:bookingId/offer", fetchBookingOffer);
router.patch("/:bookingId/offer", updateBookingOffer);
router.patch("/:bookingId/cancel", cancelBooking);

export default router;
