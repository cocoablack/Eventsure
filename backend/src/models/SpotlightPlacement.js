import mongoose from "mongoose";

const spotlightPlacementSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    startsAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    paymentReference: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const SpotlightPlacement = mongoose.model(
  "SpotlightPlacement",
  spotlightPlacementSchema
);

export default SpotlightPlacement;