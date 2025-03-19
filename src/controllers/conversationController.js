import Conversation from "@/models/chat/conversationModel";

export const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate("participants", "fullName userName profilePic")
    .populate("lastMessage");

  return conversations;
};
