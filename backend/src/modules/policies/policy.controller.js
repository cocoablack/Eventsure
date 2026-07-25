import * as policyService from "./policy.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import AppError from "../../utils/AppError.js";

export const getAllPolicies = asyncHandler(async (_req, res) => {
  const policies = await policyService.getPolicies();
  return successResponse(res, "Policies fetched successfully", { policies });
});

export const getPolicy = asyncHandler(async (req, res) => {
  const policy = await policyService.getPolicyBySlug(
    req.params.slug
  );

  if (!policy) throw new AppError("Policy not found", 404);
  return successResponse(res, "Policy fetched successfully", { policy });
});

export const createPolicy = asyncHandler(async (req, res) => {
  const policy = await policyService.createPolicy({
    ...req.body,
    updatedBy: req.user._id,
  });
  return successResponse(res, "Policy created successfully", { policy }, 201);
});

export const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await policyService.updatePolicy(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user._id,
    }
  );

  if (!policy) throw new AppError("Policy not found", 404);
  return successResponse(res, "Policy updated successfully", { policy });
});

export const deletePolicy = asyncHandler(async (req, res) => {
  const policy = await policyService.deletePolicy(req.params.id);
  if (!policy) throw new AppError("Policy not found", 404);
  return successResponse(res, "Policy deleted successfully");
});
