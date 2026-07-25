import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Booking from "../models/Booking.js";
import Offer from "../models/Offer.js";
import { BOOKING_STATUS, PAYMENT_STATUS } from "../constants/statuses.js";

dotenv.config();

const seedBookings = async () => {
  try {
    if (process.env.ALLOW_DESTRUCTIVE_SEED !== "true") throw new Error("Set ALLOW_DESTRUCTIVE_SEED=true to acknowledge destructive seed cleanup");
    await connectDB();

    const user = await User.findOne({ role: "user" });
    const vendors = await Vendor.find().limit(4);

    if (!user) {
      throw new Error("No user found. Register one user account first.");
    }

    if (vendors.length === 0) {
      throw new Error("No vendors found. Run npm run seed:vendors first.");
    }

    await Booking.deleteMany({ user: user._id });
    await Offer.deleteMany({ user: user._id });

    const bookings = await Booking.insertMany([
      {
        user: user._id,
        vendor: vendors[0]._id,
        reference: "ES-9920",
        title: "Corporate Year-End Gala",
        eventType: "Corporate Event",
        eventDate: new Date("2026-12-15"),
        location: "Lagos, Nigeria",
        guests: 250,
        services: [
          {
            title: "Catering",
            description: "Premium 5-course menu",
          },
          {
            title: "Decoration",
            description: "Modern minimalist theme",
          },
        ],
        budgetRange: "₦1.5m - ₦2m",
        status: BOOKING_STATUS.NEGOTIATING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        totalAmount: 17700,
        amountPaid: 0,
      },
      {
        user: user._id,
        vendor: vendors[1]._id,
        reference: "ES-9921",
        title: "Wedding Reception",
        eventType: "Wedding Gala",
        eventDate: new Date("2026-11-20"),
        location: "Lekki, Lagos",
        guests: 180,
        services: [
          {
            title: "Decoration",
            description: "Luxury floral design",
          },
        ],
        budgetRange: "₦500k - ₦2m",
        status: BOOKING_STATUS.ACTIVE,
        paymentStatus: PAYMENT_STATUS.PARTIAL,
        totalAmount: 4200,
        amountPaid: 1260,
      },
      {
        user: user._id,
        vendor: vendors[2]._id,
        reference: "ES-9922",
        title: "Product Launch",
        eventType: "Product Launch",
        eventDate: new Date("2026-09-10"),
        location: "Victoria Island, Lagos",
        guests: 120,
        services: [
          {
            title: "Sound & Lighting",
            description: "AV production and event lighting",
          },
        ],
        budgetRange: "₦100k - ₦500k",
        status: BOOKING_STATUS.COMPLETED,
        paymentStatus: PAYMENT_STATUS.PAID,
        totalAmount: 3100,
        amountPaid: 3100,
        completedAt: new Date("2026-09-11"),
      },
    ]);

    await Offer.insertMany([
      {
        booking: bookings[0]._id,
        user: user._id,
        vendor: vendors[0]._id,
        reference: bookings[0].reference,
        originalRequest: {
          guestCount: 250,
          date: "December 15, 2026",
          budgetRange: "₦1,500,000 - ₦2,000,000",
          services: ["Catering", "Decoration"],
        },
        proposal: {
          guestCount: 250,
          date: "December 15, 2026",
          total: 17700,
          services: [
            "Premium 5-Course Catering",
            "Signature Drinks",
            "Minimalist Decoration",
          ],
        },
        breakdown: [
          {
            title: "Premium 5-Course Dinner",
            description: "250 guests premium seasonal menu",
            amount: 14000,
          },
          {
            title: "Signature Drinks",
            description: "Open bar with signature cocktails",
            amount: 1500,
          },
          {
            title: "Event Management",
            description: "Dedicated on-site coordination",
            amount: 2200,
          },
        ],
        deposit: 5310,
        balance: 12390,
        status: "pending",
      },
    ]);

    console.log("Bookings and offers seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedBookings();
