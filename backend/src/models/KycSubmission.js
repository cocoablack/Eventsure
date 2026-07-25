import mongoose from "mongoose";
import { KYC_STATUS } from "../constants/statuses.js";

const kycSubmissionSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      default: "",
      trim: true,
    },

    taxIdentificationNumber: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    documents: {
      type: {
        identityDocument: { url: String, publicId: String, resourceType: String },
        businessCertificate: { url: String, publicId: String, resourceType: String },
        proofOfAddress: { url: String, publicId: String, resourceType: String },
        portfolio: { url: String, publicId: String, resourceType: String },
      },
      select: false,
      default: {},
    },

    status: {
      type: String,
      enum: Object.values(KYC_STATUS),
      default: KYC_STATUS.PENDING,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

kycSubmissionSchema.index({ vendor: 1, status: 1, createdAt: -1 });

const KycSubmission = mongoose.model("KycSubmission", kycSubmissionSchema);

export default KycSubmission;
