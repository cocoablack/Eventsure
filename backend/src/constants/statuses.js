export const BOOKING_STATUS = {
  PENDING: "pending",
  NEGOTIATING: "negotiating",
  CONFIRMED: "confirmed",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
  REFUNDED: "refunded",
};

export const KYC_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const CHANGE_REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export default {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  KYC_STATUS,
  CHANGE_REQUEST_STATUS,
};