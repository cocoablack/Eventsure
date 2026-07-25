import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
  userType: { type: String, enum: ["Event Planner", "Vendor", "Admin", "Guest"], default: "Guest" },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
  status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open", index: true },
}, { timestamps: true });

supportRequestSchema.index({ createdAt: -1 });

export default mongoose.models.SupportRequest || mongoose.model("SupportRequest", supportRequestSchema);
