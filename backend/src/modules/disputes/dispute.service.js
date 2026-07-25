import { randomUUID } from "node:crypto";
import Booking from "../../models/Booking.js";
import Dispute from "../../models/Dispute.js";
import AppError from "../../utils/AppError.js";

export const createDispute = async (userId, data) => {
  const booking = await Booking.findOne({ _id: data.bookingId, user: userId });
  if (!booking) throw new AppError("Booking not found", 404);
  if (!data.reason?.trim() || !data.description?.trim()) throw new AppError("Reason and description are required", 400);
  const existing = await Dispute.findOne({ booking: booking._id, user: userId, status: { $in: ["open", "investigating"] } });
  if (existing) throw new AppError("An active dispute already exists for this booking", 409);
  return Dispute.create({
    booking: booking._id,
    user: userId,
    vendor: booking.vendor,
    reference: `DSP-${randomUUID().slice(0, 8)}`.toUpperCase(),
    reason: data.reason.trim(),
    description: data.description.trim(),
  });
};

export const getUserDisputes = (userId) => Dispute.find({ user: userId }).populate("booking", "reference title status").populate("vendor", "businessName logo").sort({ createdAt: -1 });

export const getUserDispute = (disputeId, userId) => Dispute.findOne({ _id: disputeId, user: userId }).populate("booking", "reference title status").populate("vendor", "businessName logo");
