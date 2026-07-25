import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification.service.js";

export const fetchNotifications = asyncHandler(async (req, res) => {
  const notifications = await getUserNotifications(req.user._id);

  return successResponse(res, "Notifications fetched successfully", {
    notifications,
    unreadCount: notifications.filter((item) => !item.isRead).length,
  });
});

export const readNotification = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(
    req.params.notificationId,
    req.user._id
  );

  return successResponse(res, "Notification marked as read", {
    notification,
  });
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await markAllNotificationsRead(req.user._id);

  return successResponse(res, "All notifications marked as read", {
    notifications,
  });
});