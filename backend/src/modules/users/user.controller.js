import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  createChangeRequest,
  createDeleteRequest,
  getProfile,
  getUserChangeRequests,
  getUserDeleteRequests,
  updateProfile,
  getUserDashboard,
} from "./user.service.js";
import {
    getSavedVendors,
  removeSavedVendor,
  saveVendor,
} from "./user.service.js";




export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user._id);

  return successResponse(res, "Profile fetched successfully", {
    user,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user._id, req.body);

  return successResponse(res, "Profile updated successfully", {
    user,
  });
});

export const submitChangeRequest = asyncHandler(async (req, res) => {
  const {
    detailType,
    currentInformation,
    proposedInformation,
    reason,
  } = req.body;

  if (!detailType || !currentInformation || !proposedInformation || !reason) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  const changeRequest = await createChangeRequest(req.user._id, {
    detailType,
    currentInformation,
    proposedInformation,
    reason,
    supportingDocument: req.file?.path || "",
  });

  return successResponse(
    res,
    "Change request submitted successfully",
    {
      changeRequest,
    },
    201
  );
});

export const getChangeRequests = asyncHandler(async (req, res) => {
  const changeRequests = await getUserChangeRequests(req.user._id);

  return successResponse(res, "Change requests fetched successfully", {
    changeRequests,
  });
});

export const submitDeleteRequest = asyncHandler(async (req, res) => {
  const { reason, feedback } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error("Reason is required");
  }

  const deleteRequest = await createDeleteRequest(req.user._id, {
    reason,
    feedback,
  });

  return successResponse(
    res,
    "Account deletion request submitted successfully",
    {
      deleteRequest,
    },
    201
  );
});

export const getDeleteRequests = asyncHandler(async (req, res) => {
  const deleteRequests = await getUserDeleteRequests(req.user._id);

  return successResponse(res, "Deletion requests fetched successfully", {
    deleteRequests,
  });
});


export const fetchSavedVendors = asyncHandler(async (req, res) => {
  const savedVendors = await getSavedVendors(req.user._id);

  return successResponse(res, "Saved vendors fetched successfully", {
    savedVendors,
  });
});

export const addSavedVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  const savedVendors = await saveVendor(req.user._id, vendorId);

  return successResponse(res, "Vendor saved successfully", {
    savedVendors,
  });
});

export const deleteSavedVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  const savedVendors = await removeSavedVendor(req.user._id, vendorId);

  return successResponse(res, "Vendor removed from saved list", {
    savedVendors,
  });
});

export const fetchUserDashboard = asyncHandler(async (req, res) => {
  return successResponse(res, "Dashboard fetched successfully", await getUserDashboard(req.user._id));
});
