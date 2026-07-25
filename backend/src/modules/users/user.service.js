import User from "../../models/User.js";
import ChangeRequest from "../../models/ChangeRequest.js";
import DeleteRequest from "../../models/DeleteRequest.js";
import Vendor from "../../models/Vendor.js";
import Booking from "../../models/Booking.js";
import Offer from "../../models/Offer.js";
import { BOOKING_STATUS } from "../../constants/statuses.js";
import { getSpotlightVendors } from "../vendors/vendor.service.js";

export const getProfile = async (userId) => {
  return User.findById(userId).select("-password");
};

export const updateProfile = async (userId, updateData) => {
  const allowedUpdates = ["phone", "location", "avatar"];

  const updates = {};

  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
};

export const createChangeRequest = async (userId, data) => {
  return ChangeRequest.create({
    user: userId,
    requestType: "user_profile",
    detailType: data.detailType,
    currentInformation: data.currentInformation,
    proposedInformation: data.proposedInformation,
    reason: data.reason,
    supportingDocument: data.supportingDocument || "",
  });
};

export const getUserChangeRequests = async (userId) => {
  return ChangeRequest.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("reviewedBy", "fullName email role");
};

export const createDeleteRequest = async (userId, data) => {
  const existingRequest = await DeleteRequest.findOne({
    user: userId,
    status: "pending",
  });

  if (existingRequest) {
    throw new Error("You already have a pending deletion request");
  }

  return DeleteRequest.create({
    user: userId,
    reason: data.reason,
    feedback: data.feedback || "",
  });
};

export const getUserDeleteRequests = async (userId) => {
  return DeleteRequest.find({ user: userId }).sort({ createdAt: -1 });
};

export const getSavedVendors = async (userId) => {
  const user = await User.findById(userId)
    .select("savedVendors")
    .populate({
      path: "savedVendors",
      select:
        "businessName username category location coverImage logo rating reviewCount startingPrice tagline isVerified isSpotlight",
    });

  return user.savedVendors;
};

export const saveVendor = async (userId, vendorId) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  const user = await User.findById(userId);

  const alreadySaved = user.savedVendors.some(
    (id) => id.toString() === vendorId
  );

  if (!alreadySaved) {
    user.savedVendors.push(vendorId);
    await user.save();
  }

  return user.savedVendors;
};

export const removeSavedVendor = async (userId, vendorId) => {
  const user = await User.findById(userId);

  user.savedVendors = user.savedVendors.filter(
    (id) => id.toString() !== vendorId
  );

  await user.save();

  return user.savedVendors;
};

export const getUserDashboard = async (userId) => {
  const user = await User.findById(userId).select("-password");
  const [bookings, pendingOffers, spotlightVendors] = await Promise.all([
    Booking.find({ user: userId }).populate("vendor", "businessName category logo rating description").sort({ createdAt: -1 }),
    Offer.find({ user: userId, status: "pending" }).populate("vendor", "businessName").sort({ createdAt: -1 }).limit(5),
    getSpotlightVendors(),
  ]);
  const active = bookings.filter((item) => [BOOKING_STATUS.PENDING, BOOKING_STATUS.NEGOTIATING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE].includes(item.status));
  const completed = bookings.filter((item) => item.status === BOOKING_STATUS.COMPLETED);
  const paidTotal = bookings.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
  const completeness = [user.fullName, user.email, user.phone, user.location, user.avatar].filter(Boolean).length * 20;
  return {
    user: { name: user.fullName, firstName: user.fullName.split(" ")[0], membership: "Event Planner", avatar: user.avatar },
    progress: completeness,
    pendingOffers: pendingOffers.length,
    stats: { activeBookings: active.length, pendingOffers: pendingOffers.length, completedEvents: completed.length, totalSpent: paidTotal },
    recentBookings: bookings.slice(0, 5).map((booking) => ({
      id: booking._id, initials: booking.vendor?.businessName?.split(" ").map((part) => part[0]).join("").slice(0, 2) || "EV",
      vendor: booking.vendor?.businessName || "Vendor", eventType: booking.eventType, date: booking.eventDate, status: booking.status,
    })),
    negotiations: pendingOffers.map((offer) => ({ id: offer._id, type: "offer", title: `Offer from ${offer.vendor?.businessName || "vendor"}`,
      description: offer.vendorNote || "A vendor offer is waiting for your review.", action: "Review Offer", bookingId: offer.booking })),
    upcomingDates: active.filter((item) => item.eventDate > new Date()).sort((a, b) => a.eventDate - b.eventDate).slice(0, 4).map((booking) => ({
      id: booking._id, month: booking.eventDate.toLocaleString("en", { month: "short" }), day: booking.eventDate.getDate(), title: booking.title, note: booking.location,
    })),
    spotlightVendors: spotlightVendors.map((vendor) => ({ id: vendor._id, name: vendor.businessName, category: vendor.category, rating: vendor.rating, description: vendor.description })),
  };
};
