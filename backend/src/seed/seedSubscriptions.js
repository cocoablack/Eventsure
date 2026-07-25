import dotenv from "dotenv";
import connectDB from "../config/db.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";

dotenv.config();

const seedSubscriptions = async () => {
  try {
    if (process.env.ALLOW_DESTRUCTIVE_SEED !== "true") throw new Error("Set ALLOW_DESTRUCTIVE_SEED=true to acknowledge destructive seed cleanup");
    await connectDB();

    await SubscriptionPlan.deleteMany({});

    await SubscriptionPlan.insertMany([
      {
        name: "free",
        displayName: "Free",
        price: 0,
        billingCycle: "monthly",
        features: [
          "Basic vendor profile",
          "Receive booking requests",
          "Limited portfolio uploads",
        ],
      },
      {
        name: "starter",
        displayName: "Starter",
        price: 29000,
        billingCycle: "monthly",
        features: [
          "Enhanced profile visibility",
          "More portfolio uploads",
          "Basic analytics",
        ],
      },
      {
        name: "professional",
        displayName: "Professional",
        price: 49000,
        billingCycle: "monthly",
        features: [
          "Priority listing",
          "Unlimited portfolio uploads",
          "Advanced analytics",
          "Spotlight eligibility",
        ],
      },
      {
        name: "enterprise",
        displayName: "Enterprise",
        price: 129000,
        billingCycle: "monthly",
        features: [
          "Top-tier visibility",
          "Dedicated support",
          "Premium marketplace badge",
          "Advanced reporting",
        ],
      },
    ]);

    console.log("Subscription plans seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedSubscriptions();
