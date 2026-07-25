import express from "express";
import { createSupportRequest } from "./support.controller.js";
import { supportLimiter } from "../../middleware/rateLimitMiddleware.js";

const router = express.Router();
router.post("/contact", supportLimiter, createSupportRequest);
export default router;
