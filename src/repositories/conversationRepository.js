import Conversation from "../models/chat/conversationModel.js";

export const updateLastMessage = async (conversationId, messageId) => {
  return await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: messageId,
  });
};
