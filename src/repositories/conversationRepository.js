import Conversation from "../models/chat/conversationModel.js";

export const updateLastMessage = async (conversationId, messageId, at) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: messageId,
      lastMessageAt: at ? new Date(at) : new Date(), // Ensure a valid Date
    },
    { new: true }
  );
};
