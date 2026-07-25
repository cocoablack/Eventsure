import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { successResponse } from "../../utils/apiResponse.js";
import { createDispute, getUserDispute, getUserDisputes } from "./dispute.service.js";

export const submitDispute = asyncHandler(async (req, res) => successResponse(res, "Dispute submitted", { dispute: await createDispute(req.user._id, req.body) }, 201));
export const fetchDisputes = asyncHandler(async (req, res) => successResponse(res, "Disputes fetched", { disputes: await getUserDisputes(req.user._id) }));
export const fetchDispute = asyncHandler(async (req, res) => {
  const dispute = await getUserDispute(req.params.disputeId, req.user._id);
  if (!dispute) throw new AppError("Dispute not found", 404);
  return successResponse(res, "Dispute fetched", { dispute });
});
