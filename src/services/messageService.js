import {
  createMessage,
  getMessagesByConversationId,
  getUnseenMessages,
  markMessagesAsSeen,
  checkUnseenMessagesInDB,
} from "../repositories/messageRepository.js";
import { updateLastMessage } from "../repositories/conversationRepository.js";

export const saveMessageAndUpdateConversation = async ({
  sender,
  receiver,
  content,
  conversationId,
}) => {
  try {
    const message = await createMessage({
      sender,
      receiver,
      content,
      conversationId,
    });
    await updateLastMessage(conversationId, message._id);
    return message;
  } catch (error) {
    console.error("❌ Error saving message:", error);
    throw new Error("Internal Server Error");
  }
};

export const fetchMessagesAndMarkSeen = async (
  conversationId,
  loggedInUserId
) => {
  if (!conversationId || !loggedInUserId) {
    throw new Error("conversationId and loggedInUserId are required.");
  }

  // Fetch messages
  const messages = await getMessagesByConversationId(conversationId);

  // Find unseen messages
  const unseenMessages = await getUnseenMessages(
    conversationId,
    loggedInUserId
  );

  if (unseenMessages.length > 0) {
    await markMessagesAsSeen(unseenMessages.map((msg) => msg._id));
  }

  return { messages, unseenUpdated: unseenMessages.length > 0 };
};

export const checkUnseenMessages = async (userId) => {
  return await checkUnseenMessagesInDB(userId);
};
