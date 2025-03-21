import { NextResponse } from "next/server";
import Message from "@/models/chat/messageModel";

export async function GET(req) {
  try {
    // Extract userId from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    // Check if the user has unseen messages
    const hasUnseenMessages = await Message.exists({
      receiver: userId,
      seen: false,
    });

    return NextResponse.json({
      success: true,
      hasUnseenMessages: !!hasUnseenMessages,
    });
  } catch (error) {
    console.error("Error fetching unseen messages:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
