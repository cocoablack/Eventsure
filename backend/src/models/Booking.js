import mongoose from "mongoose";
import { BOOKING_STATUS, PAYMENT_STATUS } from "../constants/statuses.js";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    eventRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventRequest",
      default: null,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    eventType: {
      type: String,
      required: true,
      trim: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    services: [
      {
        title: String,
        description: String,
      },
    ],

    inspirationImages: [
      {
        type: String,
      },
    ],

    budgetRange: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.NEGOTIATING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    paymentTerms: {
      type: String,
      default: "30/70 Payment Protection",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;