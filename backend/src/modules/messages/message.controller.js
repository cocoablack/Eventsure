import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getConversationMessages,
  getUserConversations,
  sendConversationMessage,
  startConversation,
} from "./message.service.js";

export const fetchConversations = asyncHandler(async (req, res) => {
  const conversations = await getUserConversations(req.user._id);

  return successResponse(res, "Conversations fetched successfully", {
    conversations,
  });
});

export const fetchConversationDetails = asyncHandler(async (req, res) => {
  const data = await getConversationMessages(
    req.params.conversationId,
    req.user._id
  );

  return successResponse(res, "Conversation fetched successfully", data);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("Message text is required");
  }

  const message = await sendConversationMessage(
    req.params.conversationId,
    req.user._id,
    {
      text,
      attachments: [],
    }
  );

  return successResponse(
    res,
    "Message sent successfully",
    {
      message,
    },
    201
  );
});

export const createConversation = asyncHandler(async (req, res) => {
  const { vendorId, participantId, bookingId, text } = req.body;

  const data = await startConversation(req.user._id, {
    vendorId,
    participantId,
    bookingId,
    text,
  });

  return successResponse(
    res,
    "Conversation started successfully",
    data,
    201
  );
});