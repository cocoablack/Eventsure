import EventRequest from "../../models/EventRequest.js";

export const createEventRequest = async (userId, data) => {
  return EventRequest.create({
    user: userId,
    title: data.title,
    eventType: data.eventType,
    eventDate: data.eventDate,
    location: data.location,
    guestCount: data.guestCount,
    budgetRange: data.budgetRange,
    services: data.services || [],
    requirements: data.requirements || "",
    inspirationImages: data.inspirationImages || [],
    status: data.status || "posted",
  });
};

export const getUserEvents = async (userId) => {
  return EventRequest.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "fullName email phone");
};

export const getEventById = async (eventId, userId) => {
  return EventRequest.findOne({
    _id: eventId,
    user: userId,
  }).populate("user", "fullName email phone");
};