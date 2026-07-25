import User from "../../models/User.js";
import Vendor from "../../models/Vendor.js";
import Booking from "../../models/Booking.js";
import Payment from "../../models/Payment.js";
import KycSubmission from "../../models/KycSubmission.js";
import ChangeRequest from "../../models/ChangeRequest.js";
import DeleteRequest from "../../models/DeleteRequest.js";
import Dispute from "../../models/Dispute.js";
import Policy from "../../models/Policy.js";
import VendorSubscription from "../../models/VendorSubscription.js";
import SpotlightPlacement from "../../models/SpotlightPlacement.js";
import Notification from "../../models/Notification.js";
import AuditLog from "../../models/AuditLog.js";
import SupportRequest from "../../models/SupportRequest.js";
import PlatformSetting from "../../models/PlatformSetting.js";
import { ROLES } from "../../constants/roles.js";
import { BOOKING_STATUS } from "../../constants/statuses.js";
import { paginationData, paginationFromQuery, escapeRegex } from "../../utils/query.js";
import AppError from "../../utils/AppError.js";

const paginated = async (Model, filter, query, options = {}) => {
  const { page, limit, skip } = paginationFromQuery(query);
  let cursor = Model.find(filter).sort(options.sort || { createdAt: -1 }).skip(skip).limit(limit);
  for (const populate of options.populate || []) cursor = cursor.populate(populate);
  if (options.select) cursor = cursor.select(options.select);
  const [items, total] = await Promise.all([cursor, Model.countDocuments(filter)]);
  return { items, pagination: paginationData(page, limit, total) };
};

const dateFilter = (query) => {
  const createdAt = {};
  if (query.from) createdAt.$gte = new Date(query.from);
  if (query.to) createdAt.$lte = new Date(`${query.to}T23:59:59.999Z`);
  return Object.keys(createdAt).length ? { createdAt } : {};
};

export const getAdminDashboardData = async (query = {}) => {
  const dates = dateFilter(query);
  const [totalUsers, totalVendors, pendingKyc, totalBookings, activeBookings, completedBookings,
    cancelledBookings, successfulPayments, openDisputes, activeSubscriptions, recentBookings] = await Promise.all([
    User.countDocuments({ role: ROLES.USER, ...dates }), Vendor.countDocuments(dates),
    KycSubmission.countDocuments({ status: "pending", ...dates }), Booking.countDocuments(dates),
    Booking.countDocuments({ status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE] }, ...dates }),
    Booking.countDocuments({ status: BOOKING_STATUS.COMPLETED, ...dates }),
    Booking.countDocuments({ status: BOOKING_STATUS.CANCELLED, ...dates }),
    Payment.find({ status: "successful", ...dates }).select("amountKobo").lean(),
    Dispute.countDocuments({ status: { $in: ["open", "investigating"] }, ...dates }),
    VendorSubscription.countDocuments({ status: "active", expiresAt: { $gt: new Date() }, ...dates }),
    Booking.find(dates).populate("user", "fullName email").populate("vendor", "businessName category").sort({ createdAt: -1 }).limit(5),
  ]);
  const revenueKobo = successfulPayments.reduce((sum, payment) => sum + payment.amountKobo, 0);
  return {
    summary: { totalUsers, totalVendors, pendingKyc, totalBookings, activeBookings, completedBookings,
      cancelledBookings, successfulPayments: successfulPayments.length, revenueKobo, openDisputes, activeSubscriptions },
    recentBookings,
  };
};

export const getAdminUsers = async (query = {}) => {
  const filter = { role: ROLES.USER };
  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ fullName: search }, { email: search }, { username: search }];
  }
  if (query.status === "blocked") filter.isBlocked = true;
  if (query.status === "active") filter.isBlocked = false;
  return paginated(User, filter, query, { select: "-password" });
};

export const getAdminUserById = (userId) => User.findById(userId).select("-password");

export const updateAdminUserStatus = async (userId, action) => {
  const blocked = action === "block";
  if (!["block", "unblock", "restore"].includes(action)) throw new AppError("Unsupported user action", 400);
  const user = await User.findOneAndUpdate({ _id: userId, role: { $ne: ROLES.ADMIN } }, { isBlocked: blocked }, { new: true }).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const getAdminVendors = async (query = {}) => {
  const filter = {};
  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ businessName: search }, { username: search }, { email: search }];
  }
  if (query.status === "verified") filter.isVerified = true;
  if (query.status === "pending") filter.kycStatus = "pending";
  if (query.status === "blocked") filter.isActive = false;
  return paginated(Vendor, filter, query, { populate: [{ path: "owner", select: "fullName email phone" }] });
};

export const getAdminVendorById = (vendorId) => Vendor.findById(vendorId).populate("owner", "fullName email phone isBlocked");

export const updateAdminVendorStatus = async (vendorId, action) => {
  const updates = action === "block" ? { isActive: false } : action === "unblock" ? { isActive: true } :
    action === "verify" ? { isVerified: true, kycStatus: "approved" } : null;
  if (!updates) throw new AppError("Unsupported vendor action", 400);
  const vendor = await Vendor.findByIdAndUpdate(vendorId, updates, { new: true, runValidators: true });
  if (!vendor) throw new AppError("Vendor not found", 404);
  return vendor;
};

export const getAdminBookings = async (query = {}) => {
  const filter = {};
  if (query.status && query.status.toLowerCase() !== "all") filter.status = query.status.toLowerCase();
  if (query.search) filter.$or = [{ reference: new RegExp(escapeRegex(query.search), "i") }, { title: new RegExp(escapeRegex(query.search), "i") }];
  return paginated(Booking, filter, query, { populate: [
    { path: "user", select: "fullName email phone" }, { path: "vendor", select: "businessName category location" },
  ] });
};

export const getAdminBookingById = (id) => Booking.findById(id)
  .populate("user", "fullName email phone avatar").populate("vendor", "businessName category location logo").populate("eventRequest");

export const updateAdminBookingStatus = async (id, action) => {
  const status = action === "cancel" ? BOOKING_STATUS.CANCELLED : action === "complete" ? BOOKING_STATUS.COMPLETED : null;
  if (!status) throw new AppError("Unsupported booking action", 400);
  const booking = await Booking.findById(id);
  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.status === BOOKING_STATUS.CANCELLED || booking.status === BOOKING_STATUS.COMPLETED) throw new AppError("Booking is already final", 409);
  booking.status = status;
  if (status === BOOKING_STATUS.COMPLETED) booking.completedAt = new Date();
  await booking.save();
  return booking;
};

export const getAdminPayments = async (query = {}) => {
  const filter = {};
  if (query.status && query.status.toLowerCase() !== "all") filter.status = query.status.toLowerCase();
  return paginated(Payment, filter, query, { populate: [
    { path: "user", select: "fullName email" }, { path: "vendor", select: "businessName category" },
    { path: "booking", select: "reference title eventDate status" },
  ] });
};

export const getAdminPaymentById = (id) => Payment.findById(id)
  .populate("user", "fullName email").populate("vendor", "businessName category").populate("booking", "reference title eventDate status");

export const getAdminKyc = (query = {}) => paginated(KycSubmission,
  query.status && query.status.toLowerCase() !== "all" ? { status: query.status.toLowerCase() } : {}, query,
  { select: "-documents", populate: [{ path: "vendor", select: "businessName username category location" }, { path: "user", select: "fullName email phone" }] });

export const getAdminKycById = (id) => KycSubmission.findById(id)
  .select("+documents")
  .populate("vendor", "businessName username category location").populate("user", "fullName email phone");

export const getAdminChangeRequests = (query = {}) => paginated(ChangeRequest,
  query.status && query.status.toLowerCase() !== "all" ? { status: query.status.toLowerCase().replace(" ", "_") } : {}, query,
  { populate: [{ path: "user", select: "fullName email role" }, { path: "reviewedBy", select: "fullName email" }] });

export const reviewChangeRequest = async (id, adminId, action, note = "") => {
  const status = action === "approve" ? "approved" : action === "reject" ? "rejected" : null;
  if (!status) throw new AppError("Unsupported request action", 400);
  const request = await ChangeRequest.findOneAndUpdate({ _id: id, status: "pending" },
    { status, adminNote: note, reviewedBy: adminId, reviewedAt: new Date() }, { new: true });
  if (!request) throw new AppError("Pending change request not found", 404);
  return request;
};

export const getAdminDeleteRequests = (query = {}) => paginated(DeleteRequest,
  query.status ? { status: query.status } : {}, query, { populate: [{ path: "user", select: "fullName email role" }] });

export const getAdminDeleteRequestById = (id) => DeleteRequest.findById(id)
  .populate("user", "fullName email role isBlocked")
  .populate("reviewedBy", "fullName email");

export const reviewDeleteRequest = async (id, adminId, action, adminNote = "") => {
  const status = action === "approve" ? "approved" : action === "reject" ? "rejected" : null;
  if (!status) throw new AppError("Unsupported deletion request action", 400);
  const request = await DeleteRequest.findOneAndUpdate(
    { _id: id, status: "pending" },
    { status, adminNote, reviewedBy: adminId, reviewedAt: new Date() },
    { new: true, runValidators: true },
  ).populate("user", "fullName email role");
  if (!request) throw new AppError("Pending deletion request not found", 404);
  return request;
};

export const getAdminDisputes = (query = {}) => paginated(Dispute,
  query.status && query.status.toLowerCase() !== "all" ? { status: query.status.toLowerCase() } : {}, query,
  { populate: [{ path: "user", select: "fullName email" }, { path: "vendor", select: "businessName" }, { path: "booking", select: "reference title" }] });

export const getAdminDisputeById = (id) => Dispute.findById(id)
  .populate("user", "fullName email").populate("vendor", "businessName").populate("booking", "reference title status");

export const updateAdminDispute = async (id, action, body, adminId) => {
  const statusMap = { investigate: "investigating", resolve: "resolved", close: "closed", reopen: "open" };
  const status = statusMap[action];
  if (!status) throw new AppError("Unsupported dispute action", 400);
  const dispute = await Dispute.findByIdAndUpdate(id, { status, resolution: body.resolution || "", adminNotes: body.adminNotes || "",
    assignedTo: adminId, resolvedAt: status === "resolved" ? new Date() : null }, { new: true, runValidators: true });
  if (!dispute) throw new AppError("Dispute not found", 404);
  return dispute;
};

export const getAdminSubscriptions = (query = {}) => paginated(VendorSubscription,
  query.status && query.status.toLowerCase() !== "all" ? { status: query.status.toLowerCase() } : {}, query,
  { populate: [{ path: "vendor", select: "businessName email" }, { path: "plan" }] });

export const getAdminSpotlights = (query = {}) => paginated(SpotlightPlacement, {}, query,
  { populate: [{ path: "vendor", select: "businessName category isVerified isActive" }] });

export const getAdminPolicies = (query = {}) => paginated(Policy, {}, query, { populate: [{ path: "updatedBy", select: "fullName email" }] });
export const getAdminPolicyById = (id) => Policy.findById(id);

export const getAdminNotifications = async (adminId, query = {}) => {
  const filter = { recipient: adminId };
  if (query.tab === "Unread") filter.isRead = false;
  return paginated(Notification, filter, query);
};

export const getAuditLogs = (query = {}) => {
  const filter = {};
  if (query.action && query.action !== "All Actions") filter.action = query.action;
  if (query.severity && query.severity !== "All Levels") filter.severity = query.severity.toLowerCase();
  return paginated(AuditLog, filter, query, { populate: [{ path: "actor", select: "fullName email" }] });
};

export const getSupportRequests = (query = {}) => paginated(SupportRequest, query.status ? { status: query.status } : {}, query);
export const getAdminStaff = (query = {}) => paginated(User, { role: ROLES.ADMIN }, query, { select: "-password" });

export const getPlatformSettings = async () => PlatformSetting.findOneAndUpdate({ key: "platform" }, { $setOnInsert: { key: "platform" } }, { upsert: true, new: true });
export const updatePlatformSettings = async (adminId, body) => {
  const financial = { serviceFee: Number(body.serviceFee), processingFee: Number(body.processingFee) };
  const payout = { upfrontDeposit: Number(body.upfrontDeposit), finalSettlement: Number(body.finalSettlement) };
  if (Number.isFinite(payout.upfrontDeposit) && Number.isFinite(payout.finalSettlement) && payout.upfrontDeposit + payout.finalSettlement !== 100) {
    throw new AppError("Upfront deposit and final settlement must total 100", 400);
  }
  const update = { updatedBy: adminId };
  if (Number.isFinite(financial.serviceFee)) update["financial.serviceFee"] = financial.serviceFee;
  if (Number.isFinite(financial.processingFee)) update["financial.processingFee"] = financial.processingFee;
  if (Number.isFinite(payout.upfrontDeposit)) update["payout.upfrontDeposit"] = payout.upfrontDeposit;
  if (Number.isFinite(payout.finalSettlement)) update["payout.finalSettlement"] = payout.finalSettlement;
  return PlatformSetting.findOneAndUpdate({ key: "platform" }, update, { upsert: true, new: true, runValidators: true });
};
