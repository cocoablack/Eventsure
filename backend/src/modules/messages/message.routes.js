import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  createConversation,
  fetchConversationDetails,
  fetchConversations,
  sendMessage,
} from "./message.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/conversations", fetchConversations);
router.post("/start", createConversation);
router.get("/conversations/:conversationId", fetchConversationDetails);
router.post("/conversations/:conversationId", sendMessage);

export default router;