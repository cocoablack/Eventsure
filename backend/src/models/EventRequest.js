import mongoose from "mongoose";

const eventRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },

    budgetRange: {
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

    requirements: {
      type: String,
      default: "",
      trim: true,
    },

    inspirationImages: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "posted", "matched", "converted", "cancelled"],
      default: "posted",
    },
  },
  {
    timestamps: true,
  }
);

const EventRequest = mongoose.model("EventRequest", eventRequestSchema);

export default EventRequest;