import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import { fetchDispute, fetchDisputes, submitDispute } from "./dispute.controller.js";

const router = express.Router();
router.use(authMiddleware, roleMiddleware(ROLES.USER));
router.post("/", submitDispute);
router.get("/", fetchDisputes);
router.get("/:disputeId", fetchDispute);
export default router;
