import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

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

    reference: {
      type: String,
      required: true,
    },

    originalRequest: {
      guestCount: Number,
      date: String,
      budgetRange: String,
      services: [String],
    },

    proposal: {
      guestCount: Number,
      date: String,
      total: Number,
      services: [String],
    },

    breakdown: [
      {
        title: String,
        description: String,
        amount: Number,
      },
    ],

    deposit: {
      type: Number,
      default: 0,
    },

    balance: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "changes_requested"],
      default: "pending",
    },

    vendorNote: {
      type: String,
      default: "",
    },

    userNote: {
      type: String,
      default: "",
    },

    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;