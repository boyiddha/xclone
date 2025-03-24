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

export async function findConversation(participants) {
  if (participants[0] === participants[1]) {
    // Special case for self-chat
    return await Conversation.findOne({
      participants: participants,
    });
  }
  return await Conversation.findOne({
    participants: { $all: participants, $size: 2 },
  });
}

export async function createConversation(participants) {
  const newConversation = new Conversation({ participants });
  return await newConversation.save();
}

export async function getConversationsByUserId(loggedInUserId) {
  return await Conversation.find({ participants: loggedInUserId })
    .populate({
      path: "participants",
      select: "fullName userName image followers createdAt",
    })
    .populate({
      path: "lastMessage",
      select: "content sender receiver seen createdAt",
    })
    .sort({ lastMessageAt: -1 });
}
