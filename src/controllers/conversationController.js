import { NextResponse } from "next/server";
import {
  getOrCreateConversation,
  fetchUserConversations,
} from "@/services/conversationService";

export async function createOrFetchConversation(req) {
  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { message: "Sender ID and Receiver ID are required." },
        { status: 400 }
      );
    }

    const { conversation, message } = await getOrCreateConversation(
      senderId,
      receiverId
    );

    return NextResponse.json(
      { conversationId: conversation._id, message },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in conversation controller:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function getUserConversations(req) {
  const loggedInUserId = req.nextUrl.searchParams.get("loggedInUserId");

  if (!loggedInUserId) {
    return NextResponse.json(
      { message: "loggedInUserId is required." },
      { status: 400 }
    );
  }

  try {
    const chatUsers = await fetchUserConversations(loggedInUserId);
    return NextResponse.json(chatUsers);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
