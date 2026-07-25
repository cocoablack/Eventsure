import mongoose from "mongoose";
import { KYC_STATUS } from "../constants/statuses.js";

const vendorSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Vendor username is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    services: [
      {
        type: String,
        trim: true,
      },
    ],

    description: {
      type: String,
      default: "",
    },

    tagline: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    gallery: [
      {
        type: String,
      },
    ],

    startingPrice: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
    },

    responseTime: {
      type: String,
      default: "Usually replies within 24 hours",
    },

    kycStatus: {
      type: String,
      enum: Object.values(KYC_STATUS),
      default: KYC_STATUS.PENDING,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isSpotlight: {
      type: Boolean,
      default: false,
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "starter", "professional", "enterprise"],
      default: "free",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;