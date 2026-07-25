import dotenv from "dotenv";
// import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { ROLES } from "../constants/roles.js";
import { KYC_STATUS } from "../constants/statuses.js";

dotenv.config();

const seedVendors = async () => {
  try {
    if (process.env.ALLOW_DESTRUCTIVE_SEED !== "true") throw new Error("Set ALLOW_DESTRUCTIVE_SEED=true to acknowledge destructive seed cleanup");
    await connectDB();

    await Vendor.deleteMany({});
    await User.deleteMany({ role: ROLES.VENDOR });

    const hashedPassword = await bcrypt.hash("password123", 10);

    const vendorUsers = await User.insertMany(
      vendors.map((vendor) => ({
        fullName: vendor.ownerName,
        username: vendor.username,
        email: vendor.email,
        phone: vendor.phone,
        password: hashedPassword,
        role: ROLES.VENDOR,
        location: vendor.location,
        isVerified: true,
      }))
    );

    const vendorDocs = vendors.map((vendor, index) => ({
      owner: vendorUsers[index]._id,
      businessName: vendor.businessName,
      username: vendor.username,
      email: vendor.email,
      phone: vendor.phone,
      category: vendor.category,
      services: vendor.services,
      description: vendor.description,
      tagline: vendor.tagline,
      location: vendor.location,
      address: vendor.address,
      coverImage: vendor.coverImage,
      logo: vendor.logo,
      gallery: vendor.gallery,
      startingPrice: vendor.startingPrice,
      rating: vendor.rating,
      reviewCount: vendor.reviewCount,
      completedJobs: vendor.completedJobs,
      responseTime: vendor.responseTime,
      kycStatus: KYC_STATUS.APPROVED,
      isVerified: true,
      isSpotlight: vendor.isSpotlight,
      subscriptionPlan: vendor.subscriptionPlan,
      isActive: true,
    }));

    await Vendor.insertMany(vendorDocs);

    console.log("Vendor seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const vendors = [
  {
    ownerName: "Amaka Johnson",
    businessName: "Epicurean Masters",
    username: "epicureanmasters",
    email: "epicurean@example.com",
    phone: "+2348011111111",
    category: "Catering",
    services: [
      "Catering",
      "Menu Planning",
      "Food Preparation",
      "Drinks Coordination",
      "Wait Staff",
      "Event Dining Setup",
    ],
    description:
      "Premium catering and event dining experiences for galas, private celebrations, product launches, and executive events.",
    tagline: "Turning dinner into an art form.",
    location: "Lagos, Nigeria",
    address: "Victoria Island, Lagos",
    coverImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=900&auto=format&fit=crop",
    ],
    startingPrice: 4500,
    rating: 4.9,
    reviewCount: 128,
    completedJobs: 86,
    responseTime: "Usually replies within 2 hours",
    isSpotlight: true,
    subscriptionPlan: "professional",
  },
  {
    ownerName: "Tunde Martins",
    businessName: "Floral & Form",
    username: "floralform",
    email: "floral@example.com",
    phone: "+2348022222222",
    category: "Decoration",
    services: ["Decoration", "Floral Design", "Stage Design", "Lighting"],
    description:
      "Luxury floral architecture and event styling for weddings, corporate experiences, and premium social events.",
    tagline: "Translating ideas into breathtaking spaces.",
    location: "Lekki, Lagos",
    address: "Phase 1, Lekki",
    coverImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop",
    ],
    startingPrice: 3200,
    rating: 5.0,
    reviewCount: 84,
    completedJobs: 64,
    responseTime: "Usually replies within 3 hours",
    isSpotlight: true,
    subscriptionPlan: "enterprise",
  },
  {
    ownerName: "David Cole",
    businessName: "Prism Tech AV",
    username: "prismtechav",
    email: "prism@example.com",
    phone: "+2348033333333",
    category: "Entertainment",
    services: ["Sound", "Lighting", "Stage Production", "DJ"],
    description:
      "Immersive audio-visual production, stage lighting, and sound systems for premium events.",
    tagline: "Energy, sound, and lighting without compromise.",
    location: "Ikeja, Lagos",
    address: "Allen Avenue, Ikeja",
    coverImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop",
    ],
    startingPrice: 2800,
    rating: 4.8,
    reviewCount: 210,
    completedJobs: 140,
    responseTime: "Usually replies within 5 hours",
    isSpotlight: true,
    subscriptionPlan: "professional",
  },
  {
    ownerName: "Sarah Bello",
    businessName: "The Crystal Pavilion",
    username: "crystalpavilion",
    email: "crystal@example.com",
    phone: "+2348044444444",
    category: "Hall Booking",
    services: ["Venue", "Hall Booking", "Event Space", "Banquet Setup"],
    description:
      "Elegant event halls and premium venue spaces suitable for weddings, dinners, launches, and corporate events.",
    tagline: "Where grand visions come to life.",
    location: "Victoria Island, Lagos",
    address: "Ahmadu Bello Way, Victoria Island",
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop",
    logo: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=900&auto=format&fit=crop",
    ],
    startingPrice: 12000,
    rating: 5.0,
    reviewCount: 74,
    completedJobs: 52,
    responseTime: "Usually replies within 1 hour",
    isSpotlight: false,
    subscriptionPlan: "enterprise",
  },
];

seedVendors();
