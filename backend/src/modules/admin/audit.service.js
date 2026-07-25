import { createHash } from "node:crypto";
import AuditLog from "../../models/AuditLog.js";

const calculateHash = (record) => createHash("sha256").update(JSON.stringify(record)).digest("hex");

export const recordAudit = async ({ actor, action, resourceType, resourceId, metadata = {}, req, severity = "info" }) => {
  const previous = await AuditLog.findOne().sort({ createdAt: -1, _id: -1 }).select("hash").lean();
  const createdAt = new Date();
  const safeMetadata = JSON.parse(JSON.stringify(metadata, (key, value) =>
    /password|token|secret|authorization|document/i.test(key) ? undefined : value));
  const payload = {
    actor: actor.toString(), action, resourceType, resourceId: resourceId.toString(),
    metadata: safeMetadata, ipAddress: req?.ip || "", userAgent: req?.get?.("user-agent") || "",
    severity, previousHash: previous?.hash || "GENESIS", createdAt: createdAt.toISOString(),
  };
  return AuditLog.create({ ...payload, createdAt, hash: calculateHash(payload) });
};

export const verifyAuditChain = async () => {
  const logs = await AuditLog.find().sort({ createdAt: 1, _id: 1 }).lean();
  let previousHash = "GENESIS";
  for (const log of logs) {
    const payload = {
      actor: log.actor.toString(), action: log.action, resourceType: log.resourceType,
      resourceId: log.resourceId, metadata: log.metadata || {}, ipAddress: log.ipAddress || "",
      userAgent: log.userAgent || "", severity: log.severity, previousHash: log.previousHash,
      createdAt: new Date(log.createdAt).toISOString(),
    };
    if (log.previousHash !== previousHash || calculateHash(payload) !== log.hash) {
      return { valid: false, checked: logs.length, invalidRecordId: log._id };
    }
    previousHash = log.hash;
  }
  return { valid: true, checked: logs.length, invalidRecordId: null };
};
