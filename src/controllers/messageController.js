import { NextResponse } from "next/server";

import {
  saveMessageAndUpdateConversation,
  fetchMessagesAndMarkSeen,
  checkUnseenMessages,
} from "../services/messageService.js";

export const handleNewMessage = async (messageData) => {
  try {
    const savedMessage = await saveMessageAndUpdateConversation(messageData);
    return {
      status: 201,
      data: { savedMessage, message: "Message saved successfully." },
    };
  } catch (error) {
    return { status: 500, data: { message: "Internal Server Error" } };
  }
};

export const getMessages = async (conversationId, loggedInUserId) => {
  try {
    const { messages, unseenUpdated } = await fetchMessagesAndMarkSeen(
      conversationId,
      loggedInUserId
    );
    return {
      status: 200,
      data: {
        messages,
        message: "Messages retrieved successfully.",
        unseenUpdated,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: error.message || "Internal Server Error" },
    };
  }
};

export const getUnseenMessagesStatus = async (userId) => {
  try {
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    const hasUnseenMessages = await checkUnseenMessages(userId);

    return NextResponse.json({
      success: true,
      hasUnseenMessages: !!hasUnseenMessages, // Convert to boolean
    });
  } catch (error) {
    console.error("❌ Error fetching unseen messages:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
