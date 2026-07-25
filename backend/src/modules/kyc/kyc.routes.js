import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  fetchAllKycSubmissions,
  fetchKycStatus,
  reviewKycSubmission,
  submitKycApplication,
} from "./kyc.controller.js";
import { kycUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(ROLES.VENDOR), kycUpload, submitKycApplication);
router.get("/status", authMiddleware, roleMiddleware(ROLES.VENDOR), fetchKycStatus);

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  fetchAllKycSubmissions
);

router.patch(
  "/admin/:kycId/status",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  reviewKycSubmission
);

export default router;
