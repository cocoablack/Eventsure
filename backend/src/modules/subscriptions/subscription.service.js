import Vendor from "../../models/Vendor.js";
import SubscriptionPlan from "../../models/SubscriptionPlan.js";
import VendorSubscription from "../../models/VendorSubscription.js";
import SpotlightPlacement from "../../models/SpotlightPlacement.js";
import AppError from "../../utils/AppError.js";

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const getPlans = async () => {
  return SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
};

export const subscribeVendor = async (userId, planId, paymentReference = "") => {
  const vendor = await Vendor.findOne({ owner: userId });

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const plan = await SubscriptionPlan.findById(planId);

  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  if (plan.price > 0) {
    throw new AppError("Paid subscription billing is not enabled yet; no subscription was activated", 503);
  }

  await VendorSubscription.updateMany(
    { vendor: vendor._id, status: "active" },
    { status: "expired" }
  );

  const subscription = await VendorSubscription.create({
    vendor: vendor._id,
    plan: plan._id,
    status: "active",
    expiresAt: addDays(plan.billingCycle === "yearly" ? 365 : 30),
    paymentReference,
  });

  vendor.subscriptionPlan = plan.name;
  await vendor.save();

  return subscription.populate("plan");
};

export const getCurrentVendorSubscription = async (userId) => {
  const vendor = await Vendor.findOne({ owner: userId });

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const subscription = await VendorSubscription.findOne({
    vendor: vendor._id,
    status: "active",
    expiresAt: { $gt: new Date() },
  })
    .populate("plan")
    .sort({ createdAt: -1 });

  return {
    vendor,
    subscription,
  };
};

export const createSpotlight = async (userId) => {
  const vendor = await Vendor.findOne({ owner: userId });

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  throw new AppError("Spotlight billing is not enabled yet; no placement was activated", 503);
};

export const getCurrentVendorSpotlight = async (userId) => {
  const vendor = await Vendor.findOne({ owner: userId });

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  const spotlight = await SpotlightPlacement.findOne({
    vendor: vendor._id,
    status: "active",
    startsAt: { $lte: new Date() },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  return {
    vendor,
    spotlight,
  };
};
