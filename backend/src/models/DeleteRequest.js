import mongoose from "mongoose";

const deleteRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    scheduledDeletionDate: {
      type: Date,
      default: function () {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
      },
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

    adminNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);

export default DeleteRequest;