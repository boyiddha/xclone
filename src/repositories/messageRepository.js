import Message from "../models/chat/messageModel.js";

export const createMessage = async ({
  sender,
  receiver,
  content,
  conversationId,
}) => {
  return await Message.create({ sender, receiver, content, conversationId });
};

export const getMessagesByConversationId = async (conversationId) => {
  return await Message.find({ conversationId }).sort({ createdAt: 1 });
};

export const getUnseenMessages = async (conversationId, loggedInUserId) => {
  return await Message.find({
    conversationId,
    receiver: loggedInUserId,
    seen: false,
  });
};

export const markMessagesAsSeen = async (messageIds) => {
  return await Message.updateMany(
    { _id: { $in: messageIds } },
    { $set: { seen: true } }
  );
};

export const checkUnseenMessagesInDB = async (userId) => {
  return await Message.exists({ receiver: userId, seen: false });
};

export const findAndUpdateMessage = async (messageId) => {
  try {
    return await Message.findByIdAndUpdate(
      messageId,
      { seen: true },
      { new: true }
    );
  } catch (error) {
    console.error("❌ Error updating message as seen:", error);
    throw new Error("Database error while marking message as seen");
  }
};

export const updateManyMessagesAsSeen = async (messageIds) => {
  try {
    return await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { seen: true } }
    );
  } catch (error) {
    console.error("❌ Error updating messages as seen:", error);
    throw new Error("Database error while marking messages as seen");
  }
};
