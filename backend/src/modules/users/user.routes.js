import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  getChangeRequests,
  getDeleteRequests,
  getUserProfile,
  submitChangeRequest,
  submitDeleteRequest,
  updateUserProfile,
  fetchUserDashboard,
} from "./user.controller.js";
import {
    addSavedVendor,
  deleteSavedVendor,
  fetchSavedVendors,
} from "./user.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getUserProfile);
router.get("/dashboard", fetchUserDashboard);
router.patch("/profile", updateUserProfile);

router.post("/change-request", submitChangeRequest);
router.get("/change-request", getChangeRequests);

router.post("/delete-request", submitDeleteRequest);
router.get("/delete-request", getDeleteRequests);

router.get("/saved-vendors", fetchSavedVendors);
router.post("/saved-vendors/:vendorId", addSavedVendor);
router.delete("/saved-vendors/:vendorId", deleteSavedVendor);

export default router;
