import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";
import Vendor from "../../models/Vendor.js";
import Booking from "../../models/Booking.js";
import AppError from "../../utils/AppError.js";

export const getUserConversations = async (userId) => {
  return Conversation.find({
    participants: userId,
  })
    .populate("participants", "fullName username email avatar role")
    .populate("vendor", "businessName logo category")
    .populate("booking", "reference title eventDate status")
    .sort({ lastMessageAt: -1 });
};

export const getConversationMessages = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  })
    .populate("participants", "fullName username email avatar role")
    .populate("vendor", "businessName logo category")
    .populate("booking", "reference title eventDate status");

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const messages = await Message.find({
    conversation: conversationId,
  })
    .populate("sender", "fullName username avatar role")
    .sort({ createdAt: 1 });

  conversation.unreadBy = conversation.unreadBy.filter(
    (id) => id.toString() !== userId.toString()
  );

  await conversation.save();

  return {
    conversation,
    messages,
  };
};

export const sendConversationMessage = async (
  conversationId,
  userId,
  data
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: userId,
    text: data.text,
    attachments: data.attachments || [],
    readBy: [userId],
  });

  conversation.lastMessage = data.text;
  conversation.lastMessageAt = new Date();
  conversation.unreadBy = conversation.participants.filter(
    (participantId) => participantId.toString() !== userId.toString()
  );

  await conversation.save();

  return message.populate("sender", "fullName username avatar role");
};

export const startConversation = async (userId, data) => {
  const { vendorId, participantId, bookingId, text } = data;

  let otherParticipant = participantId;

  if (vendorId && !otherParticipant) {
    const vendor = await Vendor.findById(vendorId).populate("owner");

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    otherParticipant = vendor.owner._id;
  }

  if (bookingId) {
    const booking = await Booking.findById(bookingId).populate("vendor", "owner");
    if (!booking) throw new AppError("Booking not found", 404);
    const allowed = [booking.user.toString(), booking.vendor.owner.toString()];
    if (!allowed.includes(userId.toString())) throw new AppError("You cannot access this booking conversation", 403);
    otherParticipant = allowed.find((id) => id !== userId.toString());
  }

  if (!otherParticipant || (!vendorId && !bookingId)) {
    throw new AppError("A vendor or booking is required", 400);
  }

  if (otherParticipant.toString() === userId.toString()) throw new AppError("You cannot message yourself", 400);

  let conversation = await Conversation.findOne({
    participants: {
      $all: [userId, otherParticipant],
    },
    ...(bookingId ? { booking: bookingId } : {}),
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, otherParticipant],
      vendor: vendorId || null,
      booking: bookingId || null,
      lastMessage: "",
      unreadBy: [],
    });
  }

  let message = null;

  if (text) {
    message = await sendConversationMessage(conversation._id, userId, {
      text,
    });
  }

  return {
    conversation,
    message,
  };
};
