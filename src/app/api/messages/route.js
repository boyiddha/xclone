import { NextResponse } from "next/server";
import Message from "@/models/chat/messageModel";

import { saveMessageAndUpdateConversation } from "@/controllers/messageController"; // Import the controller

export async function POST(req) {
  try {
    const { sender, receiver, content, conversationId } = await req.json();

    if (!sender || !receiver || !content || !conversationId) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Call the controller to save message and update conversation
    const savedMessage = await saveMessageAndUpdateConversation({
      sender,
      receiver,
      content,
      conversationId,
    });

    return NextResponse.json(
      { savedMessage, message: "Message saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving message:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const conversationId = req.nextUrl.searchParams.get("conversationId");
    const loggedInUserId = req.nextUrl.searchParams.get("loggedInUserId"); // 👈 Get logged-in user ID

    if (!conversationId || !loggedInUserId) {
      return NextResponse.json(
        { message: "conversationId and loggedInUserId are required." },
        { status: 400 }
      );
    }

    // Fetch messages associated with this conversationId
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    // Find unseen messages sent **to** this logged-in user
    const unseenMessages = await Message.find({
      conversationId,
      receiver: loggedInUserId, // Messages where this user is the receiver
      seen: false,
    });

    if (unseenMessages.length > 0) {
      // Update all unseen messages as seen
      await Message.updateMany(
        { _id: { $in: unseenMessages.map((msg) => msg._id) } },
        { $set: { seen: true } }
      );
    }

    return NextResponse.json(
      { messages, message: "Messages retrieved and unseen messages updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
