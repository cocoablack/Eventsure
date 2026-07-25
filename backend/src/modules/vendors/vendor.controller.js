import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getSpotlightVendors,
  getVendorById,
  getVendors,
} from "./vendor.service.js";

export const fetchVendors = asyncHandler(async (req, res) => {
  const vendors = await getVendors(req.query);
  const spotlightVendors = await getSpotlightVendors();

  return successResponse(res, "Vendors fetched successfully", {
    vendors,
    spotlightVendors,
  });
});

export const fetchSpotlightVendors = asyncHandler(async (req, res) => {
  const spotlightVendors = await getSpotlightVendors();

  return successResponse(res, "Spotlight vendors fetched successfully", {
    spotlightVendors,
  });
});

export const fetchVendorDetails = asyncHandler(async (req, res) => {
  const vendor = await getVendorById(req.params.vendorId);

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  return successResponse(res, "Vendor details fetched successfully", {
    vendor,
  });
});