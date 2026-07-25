import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import Vendor from "../../models/Vendor.js";
import { ROLES } from "../../constants/roles.js";
import AppError from "../../utils/AppError.js";

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const createUser = async (userData) => {
  const normalized = {
    ...userData,
    email: userData.email.trim().toLowerCase(),
    username: userData.username.trim().toLowerCase(),
    role: userData.role === ROLES.VENDOR ? ROLES.VENDOR : ROLES.USER,
  };
  if ((normalized.password || "").length < 8) {
    throw new AppError("Password must contain at least 8 characters", 400);
  }
  const existingUser = await User.findOne({
    $or: [
      { email: normalized.email },
      { username: normalized.username },
    ],
  });

  if (existingUser) {
    throw new AppError("User with this email or username already exists", 409);
  }

  const user = await User.create(normalized);

  if (user.role === ROLES.VENDOR) {
    await Vendor.create({
      owner: user._id,
      businessName: normalized.businessName?.trim() || normalized.fullName,
      username: normalized.username,
      email: normalized.email,
      phone: normalized.phone || "",
      category: normalized.category?.trim() || "Other",
      location: normalized.location || "",
    });
  }

  return user;
};

export const loginUser = async (identifier, password) => {
  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() },
    ],
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid login credentials", 401);
  }

  if (user.isBlocked) {
    throw new AppError("Account has been blocked. Contact support.", 403);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid login credentials", 401);
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};
