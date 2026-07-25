import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createSpotlight,
  getCurrentVendorSpotlight,
  getCurrentVendorSubscription,
  getPlans,
  subscribeVendor,
} from "./subscription.service.js";

export const fetchPlans = asyncHandler(async (req, res) => {
  const plans = await getPlans();

  return successResponse(res, "Subscription plans fetched successfully", {
    plans,
  });
});

export const subscribeToPlan = asyncHandler(async (req, res) => {
  const { planId, paymentReference } = req.body;

  if (!planId) {
    res.status(400);
    throw new Error("Plan ID is required");
  }

  const subscription = await subscribeVendor(
    req.user._id,
    planId,
    paymentReference
  );

  return successResponse(
    res,
    "Vendor subscription created successfully",
    { subscription },
    201
  );
});

export const fetchCurrentSubscription = asyncHandler(async (req, res) => {
  const data = await getCurrentVendorSubscription(req.user._id);

  return successResponse(res, "Current subscription fetched successfully", data);
});

export const activateSpotlight = asyncHandler(async (req, res) => {
  const { category, amountPaid, paymentReference } = req.body;

  if (!category) {
    res.status(400);
    throw new Error("Spotlight category is required");
  }

  const spotlight = await createSpotlight(req.user._id, {
    category,
    amountPaid,
    paymentReference,
  });

  return successResponse(
    res,
    "Spotlight placement activated successfully",
    { spotlight },
    201
  );
});

export const fetchCurrentSpotlight = asyncHandler(async (req, res) => {
  const data = await getCurrentVendorSpotlight(req.user._id);

  return successResponse(res, "Current spotlight fetched successfully", data);
});