import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";

import {
  getAllPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "./policy.controller.js";

const router = express.Router();

/*
Public
*/

router.get("/", getAllPolicies);

router.get("/:slug", getPolicy);

/*
Admin
*/

router.post("/", authMiddleware, roleMiddleware(ROLES.ADMIN), createPolicy);

router.patch("/:id", authMiddleware, roleMiddleware(ROLES.ADMIN), updatePolicy);

router.delete("/:id", authMiddleware, roleMiddleware(ROLES.ADMIN), deletePolicy);

export default router;
