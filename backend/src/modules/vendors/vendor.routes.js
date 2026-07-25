import express from "express";
import {
  fetchSpotlightVendors,
  fetchVendorDetails,
  fetchVendors,
} from "./vendor.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  editVendorProfile,
  fetchActiveJobs,
  fetchCompletedJobs,
  fetchIncomingBookings,
  fetchVendorDashboard,
  fetchVendorProfile,
  respondToIncomingBooking,
  submitVendorOffer,
  fetchIncomingBookingDetails,
  submitOfferResponse,
} from "./vendor.dashboard.controller.js";

const router = express.Router();

router.get("/", fetchVendors);
router.get("/spotlight", fetchSpotlightVendors);
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  fetchVendorDashboard
);

router.get(
  "/profile/me",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  fetchVendorProfile
);

router.patch(
  "/profile/me",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  editVendorProfile
);

router.get(
  "/bookings/incoming",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  fetchIncomingBookings
);

router.get("/booking-requests/:bookingId", authMiddleware, roleMiddleware(ROLES.VENDOR), fetchIncomingBookingDetails);
router.post("/booking-requests/:bookingId/response", authMiddleware, roleMiddleware(ROLES.VENDOR), submitOfferResponse);

router.get(
  "/jobs/active",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  fetchActiveJobs
);

router.get(
  "/jobs/completed",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  fetchCompletedJobs
);

router.patch(
  "/bookings/:bookingId/respond",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  respondToIncomingBooking
);

router.post(
  "/bookings/:bookingId/offer",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  submitVendorOffer
);

router.get("/:vendorId", fetchVendorDetails);

export default router;
