import Vendor from "../../models/Vendor.js";
import Booking from "../../models/Booking.js";
import { BOOKING_STATUS } from "../../constants/statuses.js";
import Offer from "../../models/Offer.js";
import Payment from "../../models/Payment.js";
import VendorSubscription from "../../models/VendorSubscription.js";
import SpotlightPlacement from "../../models/SpotlightPlacement.js";
import { createNotification } from "../notifications/notification.service.js";
import AppError from "../../utils/AppError.js";

export const getVendorByUser = async (userId) => {
  return Vendor.findOne({ owner: userId }).populate(
    "owner",
    "fullName email phone avatar"
  );
};

export const getVendorDashboardData = async (userId) => {
  const vendor = await getVendorByUser(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const incomingRequests = await Booking.countDocuments({
    vendor: vendor._id,
    status: BOOKING_STATUS.PENDING,
  });

  const activeJobs = await Booking.countDocuments({
    vendor: vendor._id,
    status: {
      $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE],
    },
  });

  const completedJobs = await Booking.countDocuments({
    vendor: vendor._id,
    status: BOOKING_STATUS.COMPLETED,
  });

  const recentBookings = await Booking.find({
    vendor: vendor._id,
  })
    .populate("user", "fullName email phone avatar")
    .sort({ createdAt: -1 })
    .limit(5);

  const [earnings, subscription, spotlight] = await Promise.all([
    Payment.aggregate([{ $match: { vendor: vendor._id, status: "successful" } }, { $group: { _id: null, total: { $sum: "$amountKobo" } } }]),
    VendorSubscription.findOne({ vendor: vendor._id, status: "active", expiresAt: { $gt: new Date() } }).populate("plan"),
    SpotlightPlacement.findOne({ vendor: vendor._id, status: "active", expiresAt: { $gt: new Date() } }),
  ]);
  return {
    vendor: { name: vendor.owner?.fullName || vendor.businessName, businessName: vendor.businessName, trendingCategory: vendor.category, avatar: vendor.logo || vendor.owner?.avatar || "" },
    stats: { totalEarnings: (earnings[0]?.total || 0) / 100, activeJobs, newBookingRequests: incomingRequests, completedJobs },
    health: { kycStatus: vendor.kycStatus, probation: "None", subscription: subscription?.plan?.displayName || "Free", spotlight: spotlight ? "Active" : "Inactive" },
    teamPreview: recentBookings.slice(0, 3).map((booking) => ({ id: booking.user?._id, name: booking.user?.fullName, avatar: booking.user?.avatar || "" })),
    recentRequests: recentBookings.filter((booking) => [BOOKING_STATUS.PENDING, BOOKING_STATUS.NEGOTIATING].includes(booking.status)).map((booking) => ({
      id: booking._id, eventType: booking.eventType, client: booking.user?.fullName || "Client", date: booking.eventDate, budget: booking.totalAmount || 0,
    })),
    activeProgress: recentBookings.filter((booking) => [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE].includes(booking.status)).map((booking) => ({
      id: booking._id, title: booking.title, milestone: booking.status, percent: booking.status === BOOKING_STATUS.ACTIVE ? 60 : 25,
    })),
    spotlightPerformance: spotlight ? { title: `${vendor.businessName} spotlight`, description: `Placement active until ${spotlight.expiresAt.toISOString()}`, image: vendor.coverImage || vendor.logo } : { title: "No active spotlight", description: "Spotlight billing is not enabled yet.", image: vendor.coverImage || vendor.logo || "" },
  };
};

export const updateVendorProfile = async (userId, data) => {
  const vendor = await Vendor.findOne({ owner: userId });

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const allowedFields = [
    "businessName",
    "phone",
    "category",
    "services",
    "description",
    "tagline",
    "location",
    "address",
    "coverImage",
    "logo",
    "gallery",
    "startingPrice",
    "responseTime",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      vendor[field] = data[field];
    }
  });

  await vendor.save();

  return vendor;
};

export const getVendorIncomingBookings = async (userId) => {
  const vendor = await getVendorByUser(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return Booking.find({
    vendor: vendor._id,
    status: {
      $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.NEGOTIATING],
    },
  })
    .populate("user", "fullName email phone avatar")
    .sort({ createdAt: -1 });
};

export const getVendorActiveJobs = async (userId) => {
  const vendor = await getVendorByUser(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return Booking.find({
    vendor: vendor._id,
    status: {
      $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE],
    },
  })
    .populate("user", "fullName email phone avatar")
    .sort({ eventDate: 1 });
};

export const getVendorCompletedJobs = async (userId) => {
  const vendor = await getVendorByUser(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return Booking.find({
    vendor: vendor._id,
    status: BOOKING_STATUS.COMPLETED,
  })
    .populate("user", "fullName email phone avatar")
    .sort({ completedAt: -1 });
};

export const respondToBooking = async (userId, bookingId, status) => {
  const vendor = await getVendorByUser(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    vendor: vendor._id,
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (![BOOKING_STATUS.PENDING, BOOKING_STATUS.NEGOTIATING].includes(booking.status)) throw new AppError("This booking can no longer be answered", 409);

  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Invalid response status");
  }

  booking.status =
    status === "accepted"
      ? BOOKING_STATUS.NEGOTIATING
      : BOOKING_STATUS.CANCELLED;

  await booking.save();

  await createNotification({ recipient: booking.user, title: `Booking ${status}`,
    message: `${vendor.businessName} ${status} booking ${booking.reference}.`, type: "booking",
    actionUrl: `/user/bookings/${booking._id}`, dedupeKey: `booking-${status}:${booking._id}` });

  return booking;
};

export const createVendorOffer = async (userId, bookingId, data) => {
  const vendor = await getVendorByUser(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    vendor: vendor._id,
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (![BOOKING_STATUS.PENDING, BOOKING_STATUS.NEGOTIATING].includes(booking.status)) throw new AppError("An offer cannot be submitted for this booking", 409);

  const total = Number(data.total || 0);
  const deposit = Math.round(total * 0.3);
  const balance = total - deposit;

  let offer = await Offer.findOne({
    booking: booking._id,
    vendor: vendor._id,
  });

  if (offer) {
    offer.proposal = {
      guestCount: data.guestCount || booking.guests,
      date: data.date || booking.eventDate.toDateString(),
      total,
      services: data.services || booking.services.map((item) => item.title),
    };

    offer.breakdown = data.breakdown || [];
    offer.deposit = deposit;
    offer.balance = balance;
    offer.status = "pending";
    offer.vendorNote = data.vendorNote || "";

    await offer.save();
  } else {
    offer = await Offer.create({
      booking: booking._id,
      vendor: vendor._id,
      user: booking.user,
      reference: booking.reference,
      originalRequest: {
        guestCount: booking.guests,
        date: booking.eventDate.toDateString(),
        budgetRange: booking.budgetRange,
        services: booking.services.map((item) => item.title),
      },
      proposal: {
        guestCount: data.guestCount || booking.guests,
        date: data.date || booking.eventDate.toDateString(),
        total,
        services: data.services || booking.services.map((item) => item.title),
      },
      breakdown: data.breakdown || [],
      deposit,
      balance,
      status: "pending",
      vendorNote: data.vendorNote || "",
    });
  }

  booking.status = BOOKING_STATUS.NEGOTIATING;
  booking.totalAmount = total;
  await booking.save();

  await createNotification({ recipient: booking.user, title: "New vendor offer",
    message: `${vendor.businessName} submitted an offer for booking ${booking.reference}.`, type: "booking",
    actionUrl: `/user/bookings/${booking._id}/offer`, dedupeKey: `offer-received:${offer._id}:${offer.updatedAt?.getTime?.() || Date.now()}` });

  return offer;
};

export const getVendorBookingById = async (userId, bookingId) => {
  const vendor = await getVendorByUser(userId);
  if (!vendor) throw new AppError("Vendor profile not found", 404);
  const booking = await Booking.findOne({ _id: bookingId, vendor: vendor._id }).populate("user", "fullName email phone avatar");
  if (!booking) throw new AppError("Booking not found", 404);
  return { vendor, booking };
};
