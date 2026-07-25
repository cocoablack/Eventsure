import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  fetchNotifications,
  readAllNotifications,
  readNotification,
} from "./notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", fetchNotifications);
router.patch("/mark-all-read", readAllNotifications);
router.patch("/:notificationId/read", readNotification);

export default router;