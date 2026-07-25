import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

const mocks = vi.hoisted(() => ({
  user: { findOne: vi.fn(), create: vi.fn(), findById: vi.fn(), countDocuments: vi.fn() },
  vendor: { create: vi.fn(), find: vi.fn(), findOne: vi.fn(), findById: vi.fn(), countDocuments: vi.fn() },
  spotlight: { find: vi.fn() },
  event: { create: vi.fn(), find: vi.fn(), findOne: vi.fn() },
  booking: { findOne: vi.fn(), find: vi.fn(), countDocuments: vi.fn() },
  dispute: { findOne: vi.fn(), find: vi.fn(), create: vi.fn(), countDocuments: vi.fn() },
  notification: { find: vi.fn(), updateMany: vi.fn(), findOneAndUpdate: vi.fn(), create: vi.fn() },
  offer: { find: vi.fn(), findOne: vi.fn() },
  payment: { find: vi.fn() },
  deleteRequest: { find: vi.fn(), findById: vi.fn(), findOneAndUpdate: vi.fn(), countDocuments: vi.fn() },
}));

vi.mock("../src/models/User.js", () => ({ default: mocks.user }));
vi.mock("../src/models/Vendor.js", () => ({ default: mocks.vendor }));
vi.mock("../src/models/SpotlightPlacement.js", () => ({ default: mocks.spotlight }));
vi.mock("../src/models/EventRequest.js", () => ({ default: mocks.event }));
vi.mock("../src/models/Booking.js", () => ({ default: mocks.booking }));
vi.mock("../src/models/Notification.js", () => ({ default: mocks.notification }));
vi.mock("../src/models/Dispute.js", () => ({ default: mocks.dispute }));
vi.mock("../src/models/Offer.js", () => ({ default: mocks.offer }));
vi.mock("../src/models/Payment.js", () => ({ default: mocks.payment }));
vi.mock("../src/models/DeleteRequest.js", () => ({ default: mocks.deleteRequest }));

let app;
const userId = "507f1f77bcf86cd799439011";
const authUser = { _id: userId, fullName: "Test User", username: "tester", email: "test@example.com", role: "user", isBlocked: false };
const tokenFor = (id = userId) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-that-is-long-enough-for-tests";
  process.env.CORS_ORIGINS = "http://localhost:5173";
  app = (await import("../app.js")).default;
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.findById.mockReturnValue({ select: vi.fn().mockResolvedValue(authUser) });
});

describe("critical API routes", () => {
  it("returns the production health response", async () => {
    const response = await request(app).get("/api/health").expect(200);
    expect(response.body).toMatchObject({ success: true, data: { status: "ok" } });
  });

  it("registers a public user without accepting an admin role", async () => {
    mocks.user.findOne.mockResolvedValue(null);
    mocks.user.create.mockImplementation(async (input) => ({ _id: userId, ...input, avatar: "", isVerified: false }));
    const response = await request(app).post("/api/auth/register").send({
      fullName: "Test User", username: "Tester", email: "TEST@example.com", password: "strongpass1", role: "admin",
    }).expect(201);
    expect(mocks.user.create).toHaveBeenCalledWith(expect.objectContaining({ role: "user", email: "test@example.com", username: "tester" }));
    expect(response.body.data.user.role).toBe("user");
    expect(response.body.data.token).toBeTypeOf("string");
  });

  it("logs in with a normalized identifier", async () => {
    const account = { ...authUser, comparePassword: vi.fn().mockResolvedValue(true), save: vi.fn() };
    mocks.user.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(account) });
    const response = await request(app).post("/api/auth/login").send({ identifier: "TEST@example.com", password: "strongpass1" }).expect(200);
    expect(account.comparePassword).toHaveBeenCalledWith("strongpass1");
    expect(response.body.data.user.email).toBe(account.email);
  });

  it("rejects a protected route without a token", async () => {
    const response = await request(app).get("/api/users/profile").expect(401);
    expect(response.body.success).toBe(false);
  });

  it("rejects a non-admin from admin routes", async () => {
    await request(app).get("/api/admin/users").set("Authorization", `Bearer ${tokenFor()}`).expect(403);
  });

  it("returns only active vendors from the public listing", async () => {
    const populate = vi.fn().mockResolvedValue([{ _id: "vendor-1", businessName: "Real Vendor" }]);
    mocks.vendor.find
      .mockReturnValueOnce({ select: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnValue({ populate }) }) })
      .mockReturnValueOnce({ select: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([]) }) });
    mocks.spotlight.find.mockReturnValue({ sort: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue([]) }) }) });
    const response = await request(app).get("/api/vendors").expect(200);
    expect(mocks.vendor.find).toHaveBeenCalledWith({ isActive: true, isVerified: true });
    expect(response.body.data.vendors).toHaveLength(1);
  });

  it("creates an event for the authenticated user", async () => {
    mocks.event.create.mockImplementation(async (input) => ({ _id: "event-1", ...input }));
    const response = await request(app).post("/api/events").set("Authorization", `Bearer ${tokenFor()}`).send({
      title: "Launch", eventType: "Corporate", eventDate: "2027-01-10", location: "Lagos", guestCount: 40,
      budgetRange: "₦500,000 - ₦1,000,000", services: ["Catering"],
    }).expect(201);
    expect(mocks.event.create).toHaveBeenCalledWith(expect.objectContaining({ user: userId, status: "posted" }));
    expect(response.body.data.event.title).toBe("Launch");
  });

  it("does not expose another user's booking", async () => {
    mocks.booking.findOne.mockReturnValue({ populate: vi.fn().mockResolvedValue(null) });
    await request(app).get("/api/bookings/507f1f77bcf86cd799439012").set("Authorization", `Bearer ${tokenFor()}`).expect(404);
    expect(mocks.booking.findOne).toHaveBeenCalledWith(expect.objectContaining({ user: userId }));
  });

  it("scopes notification queries to the authenticated recipient", async () => {
    mocks.notification.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([]) });
    await request(app).get("/api/notifications").set("Authorization", `Bearer ${tokenFor()}`).expect(200);
    expect(mocks.notification.find).toHaveBeenCalledWith({ recipient: userId });
  });

  it("creates a dispute only against the authenticated user's booking", async () => {
    const bookingId = "507f1f77bcf86cd799439012";
    mocks.booking.findOne.mockResolvedValue({ _id: bookingId, user: userId, vendor: "507f1f77bcf86cd799439013" });
    mocks.dispute.findOne.mockResolvedValue(null);
    mocks.dispute.create.mockImplementation(async (input) => ({ _id: "dispute-1", ...input }));
    const response = await request(app).post("/api/disputes").set("Authorization", `Bearer ${tokenFor()}`).send({ bookingId, reason: "Service issue", description: "The agreed service was not delivered." }).expect(201);
    expect(mocks.booking.findOne).toHaveBeenCalledWith({ _id: bookingId, user: userId });
    expect(response.body.data.dispute.reference).toMatch(/^DSP-/);
  });

  it("scopes the offer list to the authenticated user", async () => {
    const sort = vi.fn().mockResolvedValue([]);
    const populateBooking = vi.fn().mockReturnValue({ sort });
    mocks.offer.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ populate: populateBooking }) });
    await request(app).get("/api/bookings/offers").set("Authorization", `Bearer ${tokenFor()}`).expect(200);
    expect(mocks.offer.find).toHaveBeenCalledWith({ user: userId });
  });

  it("scopes the payment list to a planner and rejects vendor access", async () => {
    const sort = vi.fn().mockResolvedValue([]);
    const populateBooking = vi.fn().mockReturnValue({ sort });
    mocks.payment.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ populate: populateBooking }) });
    await request(app).get("/api/payments").set("Authorization", `Bearer ${tokenFor()}`).expect(200);
    expect(mocks.payment.find).toHaveBeenCalledWith({ user: userId });

    mocks.user.findById.mockReturnValue({ select: vi.fn().mockResolvedValue({ ...authUser, role: "vendor" }) });
    await request(app).get("/api/payments").set("Authorization", `Bearer ${tokenFor()}`).expect(403);
  });

  it("mounts the administrator deletion-request queue", async () => {
    mocks.user.findById.mockReturnValue({ select: vi.fn().mockResolvedValue({ ...authUser, role: "admin" }) });
    const cursor = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue([]),
    };
    mocks.deleteRequest.find.mockReturnValue(cursor);
    mocks.deleteRequest.countDocuments.mockResolvedValue(0);
    const response = await request(app).get("/api/admin/deletion-requests").set("Authorization", `Bearer ${tokenFor()}`).expect(200);
    expect(response.body.data.requests).toEqual([]);
    expect(mocks.deleteRequest.find).toHaveBeenCalledWith({});
  });
});
