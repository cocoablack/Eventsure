import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  action: { type: String, required: true, trim: true, index: true },
  resourceType: { type: String, required: true, trim: true, index: true },
  resourceId: { type: String, required: true, trim: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddress: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  severity: { type: String, enum: ["info", "warning", "critical"], default: "info", index: true },
  previousHash: { type: String, default: "GENESIS" },
  hash: { type: String, required: true, unique: true },
}, { timestamps: true, versionKey: false });

auditLogSchema.index({ createdAt: -1 });
export default mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
