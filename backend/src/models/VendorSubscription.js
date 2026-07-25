import mongoose from "mongoose";

const vendorSubscriptionSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    paymentReference: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const VendorSubscription = mongoose.model(
  "VendorSubscription",
  vendorSubscriptionSchema
);

export default VendorSubscription;