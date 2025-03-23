import {
  findConversation,
  createConversation,
  getConversationsByUserId,
} from "@/repositories/conversationRepository";

export async function getOrCreateConversation(senderId, receiverId) {
  if (senderId === receiverId) {
    let conversation = await findConversation([senderId, senderId]);

    if (!conversation) {
      conversation = await createConversation([senderId, senderId]);
      return { conversation, message: "New self-chat conversation created." };
    }

    return { conversation, message: "Self-chat conversation retrieved." };
  }

  const participants = [senderId, receiverId].sort();
  let conversation = await findConversation(participants);

  if (!conversation) {
    conversation = await createConversation(participants);
  }

  return { conversation, message: "Conversation retrieved successfully." };
}

export async function fetchUserConversations(loggedInUserId) {
  const conversations = await getConversationsByUserId(loggedInUserId);

  return conversations.map((conversation) => {
    const otherUser = conversation.participants.find(
      (user) => user._id.toString() !== loggedInUserId
    );

    return {
      _id: otherUser._id,
      fullName: otherUser.fullName,
      userName: otherUser.userName,
      image: otherUser.image,
      followers: otherUser.followers,
      createdAt: otherUser.createdAt,
      lastMessage: conversation.lastMessage
        ? {
            content: conversation.lastMessage.content,
            sender: conversation.lastMessage.sender,
            receiver: conversation.lastMessage.receiver,
            seen: conversation.lastMessage.seen,
            createdAt: conversation.lastMessage.createdAt,
          }
        : null,
    };
  });
}
