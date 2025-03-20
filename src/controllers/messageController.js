import Message from "../models/chat/messageModel.js";
import Conversation from "../models/chat/conversationModel.js";

export const saveMessageAndUpdateConversation = async ({
  sender,
  receiver,
  content,
  conversationId,
}) => {
  try {
    // Create and save message
    const message = await Message.create({
      sender,
      receiver,
      content,
      conversationId,
    });

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    return message;
  } catch (error) {
    console.error("❌ Error saving message:", error);
    throw new Error("Internal Server Error");
  }
};
