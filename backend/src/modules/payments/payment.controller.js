import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  confirmPayment,
  getBookingPaymentSummary,
  processPaystackWebhook,
  initiateBookingPayment,
  getUserPayments,
} from "./payment.service.js";

export const fetchUserPayments = asyncHandler(async (req, res) =>
  successResponse(res, "Payments fetched successfully", { payments: await getUserPayments(req.user._id) }));

export const fetchBookingPaymentSummary = asyncHandler(async (req, res) => {
  const paymentData = await getBookingPaymentSummary(
    req.params.bookingId,
    req.user._id
  );

  return successResponse(res, "Payment summary fetched successfully", paymentData);
});

export const createBookingPayment = asyncHandler(async (req, res) => {
  const payment = await initiateBookingPayment(
    req.params.bookingId,
    req.user._id,
    req.body
  );

  return successResponse(
    res,
    "Payment initiated successfully",
    {
      payment,
    },
    201
  );
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await confirmPayment(
    req.params.reference,
    req.user._id
  );

  return successResponse(res, "Payment confirmed successfully", {
    payment,
  });
});

export const handlePaystackWebhook = asyncHandler(async (req, res) => {
  await processPaystackWebhook(req.headers["x-paystack-signature"], req.rawBody, req.body);
  return successResponse(res, "Webhook processed");
});
