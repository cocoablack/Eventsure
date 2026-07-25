import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
  reference: { type: String, required: true, unique: true, trim: true, uppercase: true },
  reason: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ["open", "investigating", "resolved", "closed"], default: "open", index: true },
  resolution: { type: String, default: "", trim: true, maxlength: 5000 },
  adminNotes: { type: String, default: "", trim: true, maxlength: 5000 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  resolvedAt: { type: Date, default: null },
}, { timestamps: true });

disputeSchema.index({ status: 1, createdAt: -1 });
export default mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);
