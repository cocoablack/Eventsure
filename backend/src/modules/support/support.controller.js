import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import AppError from "../../utils/AppError.js";
import SupportRequest from "../../models/SupportRequest.js";

export const createSupportRequest = asyncHandler(async (req, res) => {
  const { fullName, email, userType, subject, message } = req.body;
  if (!fullName || !email || !subject || !message) {
    throw new AppError("Full name, email, subject, and message are required", 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new AppError("Enter a valid email address", 400);
  const request = await SupportRequest.create({ fullName, email, userType, subject, message });
  return successResponse(res, "Support request submitted successfully", { requestId: request._id }, 201);
});
