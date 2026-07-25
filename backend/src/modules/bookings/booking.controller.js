import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getActiveBookings,
  getBookingById,
  getCompletedBookings,
  getOfferByBooking,
  updateOfferStatus,
  createBookingRequest,
  cancelBookingRequest,
  getUserOffers,
} from "./booking.service.js";

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await createBookingRequest(req.user._id, req.body);
  return successResponse(res, "Booking request created successfully", { booking }, 201);
});

const formatBookingForList = (booking) => {
  const total = booking.totalAmount || 0;
  const paid = booking.amountPaid || 0;

  return {
    _id: booking._id,
    reference: booking.reference,
    title: booking.title,
    eventType: booking.eventType,
    eventDate: booking.eventDate,
    location: booking.location,
    daysLeft: Math.max(
      0,
      Math.ceil((new Date(booking.eventDate) - new Date()) / (1000 * 60 * 60 * 24))
    ),
    status: booking.status,
    vendor: {
      _id: booking.vendor?._id,
      name: booking.vendor?.businessName,
      category: booking.vendor?.category,
      logo: booking.vendor?.logo || booking.vendor?.coverImage,
      image: booking.vendor?.logo || booking.vendor?.coverImage,
      location: booking.vendor?.location,
      rating: booking.vendor?.rating,
      reviewCount: booking.vendor?.reviewCount,
    },
    payment: {
      label: booking.paymentStatus,
      paid,
      total,
      percent: total > 0 ? Math.round((paid / total) * 100) : 0,
    },
    amount: total,
    finalCost: total,
  };
};

export const fetchActiveBookings = asyncHandler(async (req, res) => {
  const bookings = await getActiveBookings(req.user._id);
  const pendingPayments = bookings.reduce((sum, booking) => sum + Math.max((booking.totalAmount || 0) - (booking.amountPaid || 0), 0), 0);

  return successResponse(res, "Active bookings fetched successfully", {
    bookings: bookings.map(formatBookingForList),
    summary: {
      totalActiveBookings: bookings.length,
      pendingPayments,
      upcomingEvents: bookings.filter((booking) => booking.eventDate > new Date()).length,
    },
  });
});

export const fetchCompletedBookings = asyncHandler(async (req, res) => {
  const bookings = await getCompletedBookings(req.user._id);

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + (booking.totalAmount || 0),
    0
  );

  return successResponse(res, "Completed bookings fetched successfully", {
    bookings: bookings.map(formatBookingForList),
    summary: {
      totalEvents: bookings.length,
      totalSpent,
      averageRating: null,
      user: {
        name: req.user.fullName,
        role: "Event Planner",
        avatar: req.user.avatar,
      },
      featured:
        bookings.length > 0
          ? {
              vendor: bookings[0].vendor?.businessName,
              description: "Your most recent completed vendor booking.",
              image: bookings[0].vendor?.coverImage || bookings[0].vendor?.logo,
            }
          : {
              vendor: "No completed booking yet",
              description: "Your completed bookings will appear here.",
              image: "",
            },
    },
  });
});

export const fetchBookingDetails = asyncHandler(async (req, res) => {
  const booking = await getBookingById(req.params.bookingId, req.user._id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const offer = await getOfferByBooking(booking._id, req.user._id);

  return successResponse(res, "Booking details fetched successfully", {
    booking: {
      ...booking.toObject(),
      offer,
    },
  });
});

export const fetchBookingOffer = asyncHandler(async (req, res) => {
  const offer = await getOfferByBooking(req.params.bookingId, req.user._id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  return successResponse(res, "Offer fetched successfully", {
    offer,
  });
});

export const updateBookingOffer = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected", "changes_requested"].includes(status)) {
    res.status(400);
    throw new Error("Invalid offer status");
  }

  const offer = await updateOfferStatus(
    req.params.bookingId,
    req.user._id,
    status
  );

  return successResponse(res, "Offer updated successfully", {
    offer,
  });
});

export const fetchOffers = asyncHandler(async (req, res) =>
  successResponse(res, "Offers fetched successfully", { offers: await getUserOffers(req.user._id) }));

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await cancelBookingRequest(req.params.bookingId, req.user._id);
  return successResponse(res, "Booking request cancelled", { booking });
});
