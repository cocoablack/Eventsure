import mongoose from "mongoose";

const platformSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "platform" },
  financial: {
    serviceFee: { type: Number, min: 0, max: 100, default: 10 },
    processingFee: { type: Number, min: 0, max: 100, default: 2.5 },
  },
  payout: {
    upfrontDeposit: { type: Number, min: 0, max: 100, default: 30 },
    finalSettlement: { type: Number, min: 0, max: 100, default: 70 },
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.models.PlatformSetting || mongoose.model("PlatformSetting", platformSettingSchema);
