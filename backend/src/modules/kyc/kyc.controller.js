import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { KYC_STATUS } from "../../constants/statuses.js";
import {
  getAllKycSubmissions,
  getVendorKycStatus,
  submitKyc,
  updateKycStatus,
} from "./kyc.service.js";
import { uploadPrivateDocument } from "../../config/cloudinary.js";

export const submitKycApplication = asyncHandler(async (req, res) => {
  const {
    businessName,
    businessType,
    registrationNumber,
    taxIdentificationNumber,
    address,
    contactEmail,
    contactPhone,
  } = req.body;

  const normalized = {
    businessName: businessName || req.body.fullName,
    businessType: businessType || "Unspecified",
    address: address || req.body.officeAddress || req.body.homeAddress,
    contactEmail: contactEmail || req.user.email,
    contactPhone: contactPhone || req.user.phone,
  };
  if (!normalized.businessName || !normalized.address || !normalized.contactEmail || !normalized.contactPhone) {
    res.status(400);
    throw new Error("Please provide all required KYC fields");
  }

  const files = req.files || {};
  if (!files.governmentId?.[0] || !files.cacCertificate?.[0]) {
    res.status(400);
    throw new Error("Government ID and business certificate are required");
  }
  const folder = `eventsure/kyc/${req.user._id}`;
  const [identityDocument, businessCertificate, proofOfAddress, portfolio] = await Promise.all([
    uploadPrivateDocument(files.governmentId[0], folder),
    uploadPrivateDocument(files.cacCertificate[0], folder),
    files.faceOrLogo?.[0] ? uploadPrivateDocument(files.faceOrLogo[0], folder) : null,
    files.pastPortfolio?.[0] ? uploadPrivateDocument(files.pastPortfolio[0], folder) : null,
  ]);
  const documents = { identityDocument, businessCertificate, proofOfAddress, portfolio };

  const submission = await submitKyc(req.user._id, {
    businessName: normalized.businessName,
    businessType: normalized.businessType,
    registrationNumber,
    taxIdentificationNumber,
    address: normalized.address,
    contactEmail: normalized.contactEmail,
    contactPhone: normalized.contactPhone,
    documents,
  });

  return successResponse(
    res,
    "KYC submitted successfully",
    { submission },
    201
  );
});

export const fetchKycStatus = asyncHandler(async (req, res) => {
  const data = await getVendorKycStatus(req.user._id);

  return successResponse(res, "KYC status fetched successfully", data);
});

export const fetchAllKycSubmissions = asyncHandler(async (req, res) => {
  const submissions = await getAllKycSubmissions();

  return successResponse(res, "KYC submissions fetched successfully", {
    submissions,
  });
});

export const reviewKycSubmission = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  if (![KYC_STATUS.APPROVED, KYC_STATUS.REJECTED].includes(status)) {
    res.status(400);
    throw new Error("Invalid KYC status");
  }

  const submission = await updateKycStatus(req.params.kycId, req.user._id, {
    status,
    rejectionReason,
  });

  return successResponse(res, "KYC status updated successfully", {
    submission,
  });
});
