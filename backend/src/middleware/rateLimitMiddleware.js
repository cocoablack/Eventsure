import { rateLimit } from "express-rate-limit";

const standardOptions = {
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later.", errors: [] },
};

export const apiLimiter = rateLimit({ ...standardOptions, windowMs: 15 * 60 * 1000, limit: 500 });
export const authLimiter = rateLimit({ ...standardOptions, windowMs: 15 * 60 * 1000, limit: 20 });
export const supportLimiter = rateLimit({ ...standardOptions, windowMs: 60 * 60 * 1000, limit: 10 });
