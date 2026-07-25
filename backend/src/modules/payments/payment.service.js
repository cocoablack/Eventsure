import Booking from "../../models/Booking.js";
import Offer from "../../models/Offer.js";
import Payment from "../../models/Payment.js";
import { PAYMENT_STATUS } from "../../constants/statuses.js";
import { BOOKING_STATUS } from "../../constants/statuses.js";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import AppError from "../../utils/AppError.js";
import { hasPaystackConfig } from "../../config/env.js";
import { createNotification } from "../notifications/notification.service.js";

const generatePaymentReference = () => {
  return `ES-${Date.now()}-${randomUUID().slice(0, 8)}`.toUpperCase();
};

const paystackRequest = async (path, options = {}) => {
  if (!hasPaystackConfig()) throw new AppError("Paystack is not configured", 503);
  const response = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await response.json();
  if (!response.ok || !body.status) throw new AppError(body.message || "Payment provider request failed", 502);
  return body.data;
};

export const getBookingPaymentSummary = async (bookingId, userId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  }).populate("vendor", "businessName logo category rating reviewCount").populate("user", "email fullName");

  if (!booking) {
    throw new Error("Booking not found");
  }

  const offer = await Offer.findOne({
    booking: bookingId,
    user: userId,
  });

  const payments = await Payment.find({
    booking: bookingId,
    user: userId,
  }).sort({ createdAt: -1 });

  const totalAmount = booking.totalAmount || offer?.proposal?.total || 0;
  const amountPaid = booking.amountPaid || 0;
  const depositAmount = offer?.deposit || Math.round(totalAmount * 0.3);
  const balanceAmount = offer?.balance || totalAmount - depositAmount;

  return {
    booking,
    offer,
    payments,
    summary: {
      totalAmount,
      amountPaid,
      depositAmount,
      balanceAmount,
      paymentStatus: booking.paymentStatus,
      nextPaymentAmount:
        amountPaid === 0 ? depositAmount : Math.max(totalAmount - amountPaid, 0),
      nextPaymentType: amountPaid === 0 ? "deposit" : "balance",
    },
  };
};

export const initiateBookingPayment = async (bookingId, userId, data = {}) => {
  const { summary, booking } = await getBookingPaymentSummary(bookingId, userId);

  if (![BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE].includes(booking.status)) {
    throw new AppError("Payment is only available for a confirmed booking", 422);
  }

  const paymentType = data.paymentType || summary.nextPaymentType;
  if (!['deposit', 'balance', 'full'].includes(paymentType)) throw new AppError("Invalid payment type", 400);
  let amount = paymentType === "full" ? summary.totalAmount - summary.amountPaid :
    paymentType === "deposit" ? summary.depositAmount : summary.totalAmount - summary.amountPaid;
  amount = Math.max(Math.round(Number(amount)), 0);
  if (!amount) throw new AppError("There is no outstanding amount for this booking", 422);

  const existing = await Payment.findOne({ booking: booking._id, user: userId, paymentType, status: "pending" });
  if (existing?.authorizationUrl) return existing;

  const reference = generatePaymentReference();
  const amountKobo = amount * 100;
  const callbackUrl = `${process.env.APP_URL || process.env.CLIENT_URL}/user/bookings/${booking._id}/payment?reference=${reference}`;
  const initialized = await paystackRequest("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: booking.user?.email || data.email,
      amount: amountKobo,
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata: { bookingId: booking._id.toString(), userId: userId.toString(), paymentType },
    }),
  });

  const payment = await Payment.create({
    booking: booking._id,
    user: userId,
    vendor: booking.vendor._id,
    reference,
    paymentType,
    amountKobo,
    currency: "NGN",
    provider: "paystack",
    status: "pending",
    authorizationUrl: initialized.authorization_url,
    accessCode: initialized.access_code,
  });

  return payment;
};

const applyVerifiedPayment = async (payment, providerData) => {
  if (payment.status === "successful") return payment;
  if (providerData.status !== "success" || providerData.amount !== payment.amountKobo || providerData.currency !== "NGN") {
    throw new AppError("Payment verification did not match the expected transaction", 422);
  }
  payment.status = "successful";
  payment.providerReference = String(providerData.id || providerData.reference);
  payment.paidAt = providerData.paid_at ? new Date(providerData.paid_at) : new Date();
  payment.verificationData = { channel: providerData.channel || "", gatewayResponse: providerData.gateway_response || "" };
  await payment.save();

  const booking = await Booking.findById(payment.booking);
  const amountNaira = payment.amountKobo / 100;
  booking.amountPaid = Math.min((booking.amountPaid || 0) + amountNaira, booking.totalAmount);
  booking.paymentStatus = booking.amountPaid >= booking.totalAmount ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PARTIAL;
  if (booking.status === BOOKING_STATUS.CONFIRMED) booking.status = BOOKING_STATUS.ACTIVE;
  await booking.save();
  await createNotification({ recipient: payment.user, title: "Payment confirmed",
    message: `Payment ${payment.reference} was verified successfully.`, type: "payment",
    actionUrl: `/user/bookings/${booking._id}/payment`, dedupeKey: `payment-success:${payment._id}` });
  return payment;
};

export const getUserPayments = (userId) => Payment.find({ user: userId })
  .populate("vendor", "businessName logo category")
  .populate("booking", "reference title eventDate status")
  .sort({ createdAt: -1 });

export const confirmPayment = async (reference, userId) => {
  const payment = await Payment.findOne({
    reference,
    user: userId,
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const verified = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
  return applyVerifiedPayment(payment, verified);
};

export const processPaystackWebhook = async (signature, rawBody, event) => {
  if (!hasPaystackConfig() || !signature || !rawBody) throw new AppError("Invalid webhook", 401);
  const expected = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  const received = Buffer.from(signature);
  const calculated = Buffer.from(expected);
  if (received.length !== calculated.length || !timingSafeEqual(received, calculated)) throw new AppError("Invalid webhook signature", 401);
  if (event.event !== "charge.success") return;
  const payment = await Payment.findOne({ reference: event.data.reference });
  if (!payment) return;
  await applyVerifiedPayment(payment, event.data);
};
