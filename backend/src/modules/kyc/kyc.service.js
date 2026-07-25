import KycSubmission from "../../models/KycSubmission.js";
import Vendor from "../../models/Vendor.js";
import { KYC_STATUS } from "../../constants/statuses.js";
import { createNotification } from "../notifications/notification.service.js";

export const submitKyc = async (userId, data) => {
  const vendor = await Vendor.findOne({ owner: userId });

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const existingPending = await KycSubmission.findOne({
    vendor: vendor._id,
    status: KYC_STATUS.PENDING,
  });

  if (existingPending) {
    throw new Error("You already have a pending KYC submission");
  }

  const submission = await KycSubmission.create({
    vendor: vendor._id,
    user: userId,
    businessName: data.businessName,
    businessType: data.businessType,
    registrationNumber: data.registrationNumber || "",
    taxIdentificationNumber: data.taxIdentificationNumber || "",
    address: data.address,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    documents: data.documents || {},
  });

  vendor.kycStatus = KYC_STATUS.PENDING;
  await vendor.save();

  await createNotification({ recipient: submission.user, title: "KYC submission received",
    message: "Your verification documents were received and are waiting for administrator review.",
    type: "kyc", actionUrl: "/vendor/kyc-status", dedupeKey: `kyc-submitted:${submission._id}` });

  return submission;
};

export const getVendorKycStatus = async (userId) => {
  const vendor = await Vendor.findOne({ owner: userId });

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const latestSubmission = await KycSubmission.findOne({
    vendor: vendor._id,
  }).select("-documents").sort({ createdAt: -1 });

  return {
    vendor,
    latestSubmission,
  };
};

export const getAllKycSubmissions = async () => {
  return KycSubmission.find()
    .populate("vendor", "businessName username category location")
    .populate("user", "fullName email phone")
    .populate("reviewedBy", "fullName email")
    .sort({ createdAt: -1 });
};

export const updateKycStatus = async (kycId, adminId, data) => {
  const submission = await KycSubmission.findById(kycId).populate("vendor");

  if (!submission) {
    throw new Error("KYC submission not found");
  }

  submission.status = data.status;
  submission.rejectionReason = data.rejectionReason || "";
  submission.reviewedBy = adminId;
  submission.reviewedAt = new Date();

  await submission.save();

  const vendor = await Vendor.findById(submission.vendor._id);

  vendor.kycStatus = data.status;
  vendor.isVerified = data.status === KYC_STATUS.APPROVED;

  await vendor.save();

  await createNotification({ recipient: submission.user, title: `KYC ${data.status}`,
    message: data.status === KYC_STATUS.APPROVED
      ? "Your vendor verification was approved."
      : `Your vendor verification was rejected: ${data.rejectionReason}`,
    type: "kyc", priority: "high", actionUrl: "/vendor/kyc-status", dedupeKey: `kyc-${data.status}:${submission._id}` });

  return submission;
};
