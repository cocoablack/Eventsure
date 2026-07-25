import mongoose from "mongoose";
import { CHANGE_REQUEST_STATUS } from "../constants/statuses.js";

const changeRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestType: {
      type: String,
      enum: ["user_profile", "vendor_profile"],
      default: "user_profile",
    },

    detailType: {
      type: String,
      required: true,
      trim: true,
    },

    currentInformation: {
      type: String,
      required: true,
      trim: true,
    },

    proposedInformation: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    supportingDocument: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(CHANGE_REQUEST_STATUS),
      default: CHANGE_REQUEST_STATUS.PENDING,
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

const ChangeRequest = mongoose.model("ChangeRequest", changeRequestSchema);

export default ChangeRequest;