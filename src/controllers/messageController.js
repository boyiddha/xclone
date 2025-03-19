import Message from "@/models/chat/messageModel";
import Conversation from "@/models/chat/conversationModel";

export const saveMessage = async ({ sender, receiver, content }) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [sender, receiver] },
  });

  if (!conversation) {
    conversation = new Conversation({ participants: [sender, receiver] });
    await conversation.save();
  }

  const newMessage = new Message({
    conversationId: conversation._id,
    sender,
    receiver,
    content,
  });

  await newMessage.save();

  conversation.lastMessage = newMessage._id;
  await conversation.save();

  return newMessage;
};
