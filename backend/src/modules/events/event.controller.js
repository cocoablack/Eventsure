import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createEventRequest,
  getEventById,
  getUserEvents,
} from "./event.service.js";

export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    eventType,
    eventDate,
    location,
    guestCount,
    budgetRange,
    requirements,
    status,
  } = req.body;

  if (!title || !eventType || !eventDate || !location || !guestCount || !budgetRange) {
    res.status(400);
    throw new Error("Please provide all required event fields");
  }

  let services = [];

  if (req.body.services) {
    services =
      typeof req.body.services === "string"
        ? JSON.parse(req.body.services)
        : req.body.services;
  }

  const inspirationImages = req.files
    ? req.files.map((file) => file.path)
    : [];

  const event = await createEventRequest(req.user._id, {
    title,
    eventType,
    eventDate,
    location,
    guestCount,
    budgetRange,
    services,
    requirements,
    inspirationImages,
    status: status === "draft" ? "draft" : "posted",
  });

  return successResponse(
    res,
    "Event request created successfully",
    { event },
    201
  );
});

export const fetchMyEvents = asyncHandler(async (req, res) => {
  const events = await getUserEvents(req.user._id);

  return successResponse(res, "Events fetched successfully", {
    events,
  });
});

export const fetchEventDetails = asyncHandler(async (req, res) => {
  const event = await getEventById(req.params.eventId, req.user._id);

  if (!event) {
    res.status(404);
    throw new Error("Event request not found");
  }

  return successResponse(res, "Event details fetched successfully", {
    event,
  });
});
