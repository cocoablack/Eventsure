import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { createUser, generateToken, loginUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    username,
    email,
    phone,
    password,
    role,
    location,
    businessName,
    category,
  } = req.body;

  if (!fullName || !username || !email || !password) {
    res.status(400);
    throw new Error("Full name, username, email, and password are required");
  }

  const user = await createUser({
    fullName,
    username,
    email,
    phone,
    password,
    role: role === "vendor" ? "vendor" : "user",
    location,
    businessName,
    category,
  });

  const token = generateToken(user._id);

  return successResponse(
    res,
    "Account created successfully",
    {
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        isVerified: user.isVerified,
      },
    },
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, email, username, password } = req.body;

  const loginIdentifier = identifier || email || username;

  if (!loginIdentifier || !password) {
    res.status(400);
    throw new Error("Email/username and password are required");
  }

  const user = await loginUser(loginIdentifier, password);
  const token = generateToken(user._id);

  return successResponse(res, "Login successful", {
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      location: user.location,
      isVerified: user.isVerified,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  return successResponse(res, "Authenticated user fetched successfully", {
    user: req.user,
  });
});
