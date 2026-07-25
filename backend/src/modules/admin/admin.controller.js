import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import AppError from "../../utils/AppError.js";
import { csvEscape } from "../../utils/query.js";
import {
  getAdminBookingById, getAdminBookings, getAdminChangeRequests, getAdminDashboardData,
  getAdminDisputeById, getAdminDisputes, getAdminKyc, getAdminKycById, getAdminPaymentById,
  getAdminPayments, getAdminPolicies, getAdminPolicyById, getAdminSpotlights, getAdminStaff,
  getAdminSubscriptions, getAdminUserById, getAdminUsers, getAdminVendorById, getAdminVendors,
  getAdminNotifications, getAuditLogs, getPlatformSettings, getSupportRequests, reviewChangeRequest,
  getAdminDeleteRequests, getAdminDeleteRequestById, reviewDeleteRequest,
  updateAdminBookingStatus, updateAdminDispute, updateAdminUserStatus, updateAdminVendorStatus,
  updatePlatformSettings,
} from "./admin.service.js";
import { updateKycStatus } from "../kyc/kyc.service.js";
import { markAllNotificationsRead, markNotificationRead } from "../notifications/notification.service.js";
import { recordAudit, verifyAuditChain } from "./audit.service.js";
import Policy from "../../models/Policy.js";
import SpotlightPlacement from "../../models/SpotlightPlacement.js";

const list = (res, message, key, result) => successResponse(res, message, { [key]: result.items, pagination: result.pagination });
const ensureFound = (value, message) => {
  if (!value) throw new AppError(message, 404);
  return value;
};

export const fetchAdminDashboard = asyncHandler(async (req, res) =>
  successResponse(res, "Admin dashboard fetched successfully", await getAdminDashboardData(req.query)));

export const fetchAdminUsers = asyncHandler(async (req, res) => list(res, "Users fetched successfully", "users", await getAdminUsers(req.query)));
export const fetchAdminUserDetails = asyncHandler(async (req, res) => successResponse(res, "User details fetched successfully", { user: ensureFound(await getAdminUserById(req.params.userId), "User not found") }));
export const updateAdminUser = asyncHandler(async (req, res) => {
  const user = await updateAdminUserStatus(req.params.userId, req.params.action);
  await recordAudit({ actor: req.user._id, action: `user.${req.params.action}`, resourceType: "User", resourceId: user._id, req, severity: "warning" });
  return successResponse(res, "User status updated", { user });
});

export const fetchAdminVendors = asyncHandler(async (req, res) => list(res, "Vendors fetched successfully", "vendors", await getAdminVendors(req.query)));
export const fetchAdminVendorDetails = asyncHandler(async (req, res) => successResponse(res, "Vendor details fetched successfully", { vendor: ensureFound(await getAdminVendorById(req.params.vendorId), "Vendor not found") }));
export const updateAdminVendor = asyncHandler(async (req, res) => {
  const vendor = await updateAdminVendorStatus(req.params.vendorId, req.params.action);
  await recordAudit({ actor: req.user._id, action: `vendor.${req.params.action}`, resourceType: "Vendor", resourceId: vendor._id, req, severity: "warning" });
  return successResponse(res, "Vendor status updated", { vendor });
});

export const fetchAdminBookings = asyncHandler(async (req, res) => list(res, "Bookings fetched successfully", "bookings", await getAdminBookings(req.query)));
export const fetchAdminBookingDetails = asyncHandler(async (req, res) => successResponse(res, "Booking fetched successfully", { booking: ensureFound(await getAdminBookingById(req.params.bookingId), "Booking not found") }));
export const updateAdminBooking = asyncHandler(async (req, res) => {
  const booking = await updateAdminBookingStatus(req.params.bookingId, req.params.action);
  await recordAudit({ actor: req.user._id, action: `booking.${req.params.action}`, resourceType: "Booking", resourceId: booking._id, req, severity: "warning" });
  return successResponse(res, "Booking updated", { booking });
});

export const fetchAdminPayments = asyncHandler(async (req, res) => list(res, "Payments fetched successfully", "payments", await getAdminPayments(req.query)));
export const fetchAdminPaymentDetails = asyncHandler(async (req, res) => successResponse(res, "Payment fetched successfully", { payment: ensureFound(await getAdminPaymentById(req.params.paymentId), "Payment not found") }));
export const updateAdminPayment = asyncHandler(async () => {
  throw new AppError("Payment status cannot be changed manually; verify or refund through Paystack", 501);
});

export const fetchAdminKyc = asyncHandler(async (req, res) => list(res, "KYC submissions fetched", "reviews", await getAdminKyc({ ...req.query, status: req.query.status || req.query.tab })));
export const fetchAdminKycDetails = asyncHandler(async (req, res) => successResponse(res, "KYC submission fetched", { review: ensureFound(await getAdminKycById(req.params.kycId), "KYC submission not found") }));
export const reviewAdminKyc = asyncHandler(async (req, res) => {
  const action = req.params.action;
  const status = action === "approve" ? "approved" : action === "reject" ? "rejected" : null;
  if (!status) throw new AppError("Unsupported KYC action", 400);
  if (status === "rejected" && !req.body.rejectionReason) throw new AppError("A rejection reason is required", 400);
  const submission = await updateKycStatus(req.params.kycId, req.user._id, { status, rejectionReason: req.body.rejectionReason });
  await recordAudit({ actor: req.user._id, action: `kyc.${status}`, resourceType: "KycSubmission", resourceId: submission._id, req, severity: "warning" });
  return successResponse(res, "KYC review completed", { submission });
});

export const fetchChangeRequests = asyncHandler(async (req, res) => list(res, "Change requests fetched", "requests", await getAdminChangeRequests(req.query)));
export const fetchChangeRequestDetails = asyncHandler(async (req, res) => {
  const result = await getAdminChangeRequests({ ...req.query, limit: 100 });
  const request = result.items.find((item) => item._id.toString() === req.params.requestId);
  return successResponse(res, "Change request fetched", { request: ensureFound(request, "Change request not found") });
});
export const reviewAdminChangeRequest = asyncHandler(async (req, res) => {
  const request = await reviewChangeRequest(req.params.requestId, req.user._id, req.params.action, req.body.adminNote);
  await recordAudit({ actor: req.user._id, action: `change_request.${req.params.action}`, resourceType: "ChangeRequest", resourceId: request._id, req, severity: "warning" });
  return successResponse(res, "Change request reviewed", { request });
});

export const fetchDeleteRequests = asyncHandler(async (req, res) =>
  list(res, "Deletion requests fetched", "requests", await getAdminDeleteRequests(req.query)));
export const fetchDeleteRequestDetails = asyncHandler(async (req, res) =>
  successResponse(res, "Deletion request fetched", {
    request: ensureFound(await getAdminDeleteRequestById(req.params.requestId), "Deletion request not found"),
  }));
export const reviewAdminDeleteRequest = asyncHandler(async (req, res) => {
  const request = await reviewDeleteRequest(req.params.requestId, req.user._id, req.params.action, req.body.adminNote);
  await recordAudit({ actor: req.user._id, action: `deletion_request.${req.params.action}`, resourceType: "DeleteRequest", resourceId: request._id, req, severity: "critical" });
  return successResponse(res, "Deletion request reviewed", { request });
});

export const fetchDisputes = asyncHandler(async (req, res) => list(res, "Disputes fetched", "disputes", await getAdminDisputes(req.query)));
export const fetchDisputeDetails = asyncHandler(async (req, res) => successResponse(res, "Dispute fetched", { dispute: ensureFound(await getAdminDisputeById(req.params.disputeId), "Dispute not found") }));
export const updateDispute = asyncHandler(async (req, res) => {
  const dispute = await updateAdminDispute(req.params.disputeId, req.params.action, req.body, req.user._id);
  await recordAudit({ actor: req.user._id, action: `dispute.${req.params.action}`, resourceType: "Dispute", resourceId: dispute._id, req, severity: "warning" });
  return successResponse(res, "Dispute updated", { dispute });
});

export const fetchSubscriptions = asyncHandler(async (req, res) => list(res, "Subscriptions fetched", "subscriptions", await getAdminSubscriptions(req.query)));
export const fetchSpotlights = asyncHandler(async (req, res) => list(res, "Spotlight placements fetched", "spotlights", await getAdminSpotlights(req.query)));
export const resolveSpotlight = asyncHandler(async (req, res) => {
  const placement = await SpotlightPlacement.findByIdAndUpdate(req.params.spotlightId, { status: "cancelled" }, { new: true });
  ensureFound(placement, "Spotlight placement not found");
  await recordAudit({ actor: req.user._id, action: "spotlight.cancel", resourceType: "SpotlightPlacement", resourceId: placement._id, req, severity: "warning" });
  return successResponse(res, "Spotlight placement cancelled", { placement });
});

export const fetchPolicies = asyncHandler(async (req, res) => list(res, "Policies fetched", "policies", await getAdminPolicies(req.query)));
export const fetchPolicyDetails = asyncHandler(async (req, res) => successResponse(res, "Policy fetched", { policy: ensureFound(await getAdminPolicyById(req.params.policyId), "Policy not found") }));
export const updatePolicyPublication = asyncHandler(async (req, res) => {
  const isPublished = req.params.action === "publish" ? true : req.params.action === "draft" ? false : null;
  if (isPublished === null) throw new AppError("Unsupported policy action", 400);
  const policy = await Policy.findByIdAndUpdate(req.params.policyId, { ...req.body, isPublished, updatedBy: req.user._id }, { new: true, runValidators: true });
  ensureFound(policy, "Policy not found");
  await recordAudit({ actor: req.user._id, action: `policy.${req.params.action}`, resourceType: "Policy", resourceId: policy._id, req });
  return successResponse(res, "Policy updated", { policy });
});

export const fetchNotifications = asyncHandler(async (req, res) => list(res, "Notifications fetched", "notifications", await getAdminNotifications(req.user._id, req.query)));
export const markAllAdminNotifications = asyncHandler(async (req, res) => successResponse(res, "Notifications marked as read", { notifications: await markAllNotificationsRead(req.user._id) }));
export const markAdminNotification = asyncHandler(async (req, res) => successResponse(res, "Notification marked as read", { notification: await markNotificationRead(req.params.notificationId, req.user._id) }));

export const fetchAuditLogs = asyncHandler(async (req, res) => list(res, "Audit logs fetched", "auditLogs", await getAuditLogs(req.query)));
export const validateAuditIntegrity = asyncHandler(async (_req, res) => successResponse(res, "Audit chain checked", await verifyAuditChain()));
export const exportAuditLogs = asyncHandler(async (req, res) => {
  const result = await getAuditLogs({ ...req.query, page: 1, limit: 100 });
  const rows = [["Timestamp", "Actor", "Action", "Resource Type", "Resource ID", "Severity", "Hash"],
    ...result.items.map((item) => [item.createdAt.toISOString(), item.actor?.email || item.actor?._id || "", item.action, item.resourceType, item.resourceId, item.severity, item.hash])];
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="eventsure-audit-logs.csv"');
  return res.status(200).send(rows.map((row) => row.map(csvEscape).join(",")).join("\n"));
});

export const fetchReports = asyncHandler(async (req, res) => successResponse(res, "Reports fetched", { reports: await getAdminDashboardData(req.query) }));
export const exportReports = asyncHandler(async (req, res) => {
  const report = await getAdminDashboardData(req.query);
  const rows = [["Metric", "Value"], ...Object.entries(report.summary)];
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="eventsure-report.csv"');
  return res.status(200).send(rows.map((row) => row.map(csvEscape).join(",")).join("\n"));
});

export const fetchSettings = asyncHandler(async (_req, res) => successResponse(res, "Settings fetched", { settings: await getPlatformSettings() }));
export const saveSettings = asyncHandler(async (req, res) => {
  const settings = await updatePlatformSettings(req.user._id, req.body);
  await recordAudit({ actor: req.user._id, action: "settings.update", resourceType: "PlatformSetting", resourceId: settings._id, req, severity: "critical" });
  return successResponse(res, "Settings updated", { settings });
});

export const fetchStaff = asyncHandler(async (req, res) => list(res, "Admin staff fetched", "staff", await getAdminStaff(req.query)));
export const inviteStaff = asyncHandler(async () => { throw new AppError("Staff invitation requires configured transactional email and is not enabled", 501); });
export const fetchSupportRequests = asyncHandler(async (req, res) => list(res, "Support requests fetched", "requests", await getSupportRequests(req.query)));
