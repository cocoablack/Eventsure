import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import { validateEnvironment } from "../config/env.js";

dotenv.config();

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";
const fullName = (process.env.ADMIN_FULL_NAME || "EventSure Administrator").trim();

try {
  validateEnvironment();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("ADMIN_EMAIL must be a valid email address");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must contain at least 12 characters");
  await connectDB();
  const existing = await User.findOne({ email }).select("+password");
  if (existing) {
    existing.role = ROLES.ADMIN;
    existing.isBlocked = false;
    existing.password = password;
    await existing.save();
    console.log(`Admin access updated for ${email}`);
  } else {
    const usernameBase = email.split("@")[0].replace(/[^a-z0-9_]/g, "").slice(0, 20) || "admin";
    await User.create({
      fullName,
      username: `${usernameBase}_${Date.now().toString().slice(-6)}`,
      email,
      password,
      role: ROLES.ADMIN,
      isVerified: true,
    });
    console.log(`Admin account created for ${email}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
