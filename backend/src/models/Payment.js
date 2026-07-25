import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

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

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    paymentType: {
      type: String,
      enum: ["deposit", "balance", "full"],
      default: "deposit",
    },

    amountKobo: {
      type: Number,
      required: true,
      min: 100,
    },

    currency: {
      type: String,
      enum: ["NGN"],
      default: "NGN",
    },

    status: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded"],
      default: "pending",
    },

    provider: {
      type: String,
      enum: ["paystack"],
      default: "paystack",
    },

    providerReference: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },
    authorizationUrl: { type: String, default: "" },
    accessCode: { type: String, default: "", select: false },
    verificationData: {
      channel: { type: String, default: "" },
      gatewayResponse: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ booking: 1, user: 1, status: 1 });
paymentSchema.index({ providerReference: 1 }, { sparse: true });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
