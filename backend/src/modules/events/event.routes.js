import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  createEvent,
  fetchEventDetails,
  fetchMyEvents,
} from "./event.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware(ROLES.USER));

router.post("/", createEvent);
router.get("/my-events", fetchMyEvents);
router.get("/:eventId", fetchEventDetails);

export default router;
