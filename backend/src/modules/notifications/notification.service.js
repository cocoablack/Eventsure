import Notification from "../../models/Notification.js";

export const getUserNotifications = async (userId) => {
  return Notification.find({ recipient: userId }).sort({ createdAt: -1 });
};

export const markNotificationRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: userId,
    },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const markAllNotificationsRead = async (userId) => {
  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    { isRead: true }
  );

  return Notification.find({ recipient: userId }).sort({ createdAt: -1 });
};

export const createNotification = async ({
  recipient,
  title,
  message,
  type = "system",
  priority = "medium",
  actionUrl = "",
  dedupeKey = null,
}) => {
  if (dedupeKey) {
    return Notification.findOneAndUpdate({ recipient, dedupeKey }, { $setOnInsert: { title, message, type, priority, actionUrl, dedupeKey } }, { upsert: true, new: true });
  }
  return Notification.create({
    recipient,
    title,
    message,
    type,
    priority,
    actionUrl,
    dedupeKey,
  });
};
