import express from "express";
import { login, me, register } from "./auth.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { authLimiter } from "../../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authMiddleware, me);

export default router;
