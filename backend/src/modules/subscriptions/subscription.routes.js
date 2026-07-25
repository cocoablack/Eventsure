import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  activateSpotlight,
  fetchCurrentSpotlight,
  fetchCurrentSubscription,
  fetchPlans,
  subscribeToPlan,
} from "./subscription.controller.js";

const router = express.Router();

router.get("/plans", fetchPlans);

router.post(
  "/vendor",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  subscribeToPlan
);

router.get(
  "/vendor/current",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  fetchCurrentSubscription
);

router.post(
  "/spotlight",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  activateSpotlight
);

router.get(
  "/spotlight/vendor/current",
  authMiddleware,
  roleMiddleware(ROLES.VENDOR),
  fetchCurrentSpotlight
);

export default router;