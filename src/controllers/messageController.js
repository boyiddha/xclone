import { NextResponse } from "next/server.js";

import {
  saveMessageAndUpdateConversation,
  fetchMessagesAndMarkSeen,
  checkUnseenMessages,
  markMessageAsSeenService,
  markMessagesAsSeenBulkService,
} from "../services/messageService.js";

export const handleNewMessage = async (body) => {
  if (!body.sender || !body.receiver || !body.content || !body.conversationId) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const savedMessage = await saveMessageAndUpdateConversation(body);

    return NextResponse.json(
      { savedMessage, message: "Message saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in handleNewMessage:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
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

export const markMessageAsSeen = async (req, res) => {
  const { messageId } = req.body;

  try {
    const message = await markMessageAsSeenService(messageId);
    return NextResponse.json(
      { success: true, message: message },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
};

export const markMessagesAsSeenBulk = async (req, res) => {
  const { messageIds } = req.body;

  try {
    const updatedMessageIds = await markMessagesAsSeenBulkService(messageIds);
    return NextResponse.json(
      { success: true, messageIds: updatedMessageIds },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
};
