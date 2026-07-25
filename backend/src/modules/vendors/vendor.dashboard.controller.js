import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getVendorActiveJobs,
  getVendorByUser,
  getVendorCompletedJobs,
  getVendorDashboardData,
  getVendorIncomingBookings,
  updateVendorProfile,
  createVendorOffer,
  respondToBooking,
  getVendorBookingById,
} from "./vendor.dashboard.service.js";

export const fetchVendorDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getVendorDashboardData(req.user._id);

  return successResponse(res, "Vendor dashboard fetched successfully", dashboard);
});

export const fetchVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await getVendorByUser(req.user._id);

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor profile not found");
  }

  return successResponse(res, "Vendor profile fetched successfully", {
    vendor: {
      ...vendor.toObject(),
      businessAddress: vendor.address,
      verificationStatus: vendor.kycStatus,
      spotlightStatus: vendor.isSpotlight ? "Active" : "Inactive",
      avatar: vendor.logo || vendor.owner?.avatar || "",
      nextBillingCycle: "Not applicable",
    },
  });
});

export const editVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await updateVendorProfile(req.user._id, req.body);

  return successResponse(res, "Vendor profile updated successfully", {
    vendor,
  });
});

export const fetchIncomingBookings = asyncHandler(async (req, res) => {
  const bookings = await getVendorIncomingBookings(req.user._id);

  return successResponse(res, "Incoming bookings fetched successfully", {
    bookings,
  });
});

export const fetchActiveJobs = asyncHandler(async (req, res) => {
  const jobs = await getVendorActiveJobs(req.user._id);

  return successResponse(res, "Active jobs fetched successfully", {
    jobs,
  });
});

export const fetchCompletedJobs = asyncHandler(async (req, res) => {
  const jobs = await getVendorCompletedJobs(req.user._id);

  return successResponse(res, "Completed jobs fetched successfully", {
    jobs,
  });
});

export const respondToIncomingBooking = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await respondToBooking(
    req.user._id,
    req.params.bookingId,
    status
  );

  return successResponse(res, "Booking response submitted successfully", {
    booking,
  });
});

export const submitVendorOffer = asyncHandler(async (req, res) => {
  const { total } = req.body;

  if (!total) {
    res.status(400);
    throw new Error("Offer total is required");
  }

  const offer = await createVendorOffer(
    req.user._id,
    req.params.bookingId,
    req.body
  );

  return successResponse(
    res,
    "Vendor offer submitted successfully",
    { offer },
    201
  );
});

export const fetchIncomingBookingDetails = asyncHandler(async (req, res) => {
  const { booking, vendor } = await getVendorBookingById(req.user._id, req.params.bookingId);
  const request = {
    _id: booking._id, title: booking.title, client: booking.user?.fullName || "Client", location: booking.location,
    date: booking.eventDate, guests: booking.guests, clientBudget: booking.totalAmount || 0,
    vendor: { name: vendor.businessName, avatar: vendor.logo || "" },
    services: (booking.services || []).map((service) => ({ name: service.title })),
    inspiration: (booking.inspirationImages || []).map((url, index) => ({ id: index, type: "image", url })),
  };
  return successResponse(res, "Booking request fetched", { request });
});

export const submitOfferResponse = asyncHandler(async (req, res) => {
  if (["reject", "decline"].includes(req.body.action)) {
    const booking = await respondToBooking(req.user._id, req.params.bookingId, "rejected");
    return successResponse(res, "Booking request declined", { booking });
  }
  const total = Number(req.body.counterPrice || req.body.total);
  if (!Number.isFinite(total) || total <= 0) throw new Error("A valid offer amount is required");
  const offer = await createVendorOffer(req.user._id, req.params.bookingId, {
    total, services: req.body.selectedServices || req.body.services, vendorNote: req.body.notes || "",
  });
  return successResponse(res, "Offer submitted", { offer }, 201);
});
