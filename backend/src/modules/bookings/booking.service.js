import Booking from "../../models/Booking.js";
import Offer from "../../models/Offer.js";
import { BOOKING_STATUS } from "../../constants/statuses.js";
import Vendor from "../../models/Vendor.js";
import EventRequest from "../../models/EventRequest.js";
import AppError from "../../utils/AppError.js";
import { createNotification } from "../notifications/notification.service.js";
import { randomUUID } from "node:crypto";

const populateBooking = [
  { path: "user", select: "fullName email phone avatar" },
  {
    path: "vendor",
    select:
      "businessName username category location logo coverImage rating reviewCount completedJobs responseTime startingPrice isVerified",
  },
  { path: "eventRequest" },
];

export const createBookingRequest = async (userId, data) => {
  if (!data.vendorId) throw new AppError("Vendor ID is required", 400);
  const vendor = await Vendor.findOne({ _id: data.vendorId, isActive: true, isVerified: true });
  if (!vendor) throw new AppError("Vendor not found", 404);
  let event = null;
  if (data.eventRequestId) {
    event = await EventRequest.findOne({ _id: data.eventRequestId, user: userId });
    if (!event) throw new AppError("Event request not found", 404);
  }
  const source = event || data;
  const booking = await Booking.create({
    user: userId, vendor: vendor._id, eventRequest: event?._id || null,
    reference: `ES-${randomUUID().slice(0, 8)}`.toUpperCase(),
    title: source.title, eventType: source.eventType, eventDate: source.eventDate,
    location: source.location, guests: source.guestCount || source.guests,
    services: (source.services || []).map((service) => typeof service === "string" ? { title: service, description: "" } : service),
    budgetRange: source.budgetRange || "", status: BOOKING_STATUS.PENDING,
  });
  await createNotification({ recipient: vendor.owner, title: "New booking request", message: `${booking.title} requires your response`,
    type: "booking", actionUrl: `/vendor/booking-requests/${booking._id}/respond`, dedupeKey: `booking-created:${booking._id}` });
  return booking;
};

export const getActiveBookings = async (userId) => {
  return Booking.find({
    user: userId,
    status: {
      $in: [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.NEGOTIATING,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.ACTIVE,
      ],
    },
  })
    .populate(populateBooking)
    .sort({ createdAt: -1 });
};

export const getCompletedBookings = async (userId) => {
  return Booking.find({
    user: userId,
    status: BOOKING_STATUS.COMPLETED,
  })
    .populate(populateBooking)
    .sort({ completedAt: -1, createdAt: -1 });
};

export const getBookingById = async (bookingId, userId) => {
  return Booking.findOne({
    _id: bookingId,
    user: userId,
  }).populate(populateBooking);
};

export const getOfferByBooking = async (bookingId, userId) => {
  return Offer.findOne({
    booking: bookingId,
    user: userId,
  })
    .populate("vendor", "businessName logo rating reviewCount responseTime")
    .populate("user", "fullName avatar email");
};

export const updateOfferStatus = async (bookingId, userId, status) => {
  const offer = await Offer.findOne({
    booking: bookingId,
    user: userId,
  });

  if (!offer) {
    throw new AppError("Offer not found", 404);
  }

  if (offer.status !== "pending" && offer.status !== "changes_requested") throw new AppError("This offer can no longer be changed", 409);

  offer.status = status;

  if (status === "accepted") {
    offer.acceptedAt = new Date();

    await Booking.findByIdAndUpdate(bookingId, {
      status: BOOKING_STATUS.CONFIRMED,
      totalAmount: offer.proposal.total,
    });
  }

  if (status === "rejected") await Booking.findByIdAndUpdate(bookingId, { status: BOOKING_STATUS.CANCELLED });

  await offer.save();

  const vendor = await Vendor.findById(offer.vendor).select("owner");
  if (vendor) await createNotification({ recipient: vendor.owner, title: `Offer ${status.replace("_", " ")}`,
    message: `The offer for booking ${offer.reference} was ${status.replace("_", " ")}.`, type: "booking",
    actionUrl: `/vendor/booking-requests/${bookingId}/respond`, dedupeKey: `offer-${status}:${offer._id}` });

  return offer;
};

export const getUserOffers = (userId) => Offer.find({ user: userId })
  .populate("vendor", "businessName logo category")
  .populate("booking", "reference title eventDate status paymentStatus")
  .sort({ createdAt: -1 });

export const cancelBookingRequest = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) throw new AppError("Booking not found", 404);
  if (![BOOKING_STATUS.PENDING, BOOKING_STATUS.NEGOTIATING].includes(booking.status)) {
    throw new AppError("Only pending or negotiating bookings can be cancelled here", 409);
  }
  booking.status = BOOKING_STATUS.CANCELLED;
  await booking.save();
  const vendor = await Vendor.findById(booking.vendor).select("owner");
  if (vendor) await createNotification({ recipient: vendor.owner, title: "Booking request cancelled", message: `${booking.title} was cancelled by the planner.`, type: "booking", actionUrl: "/vendor/booking-requests", dedupeKey: `booking-cancelled:${booking._id}` });
  return booking;
};
