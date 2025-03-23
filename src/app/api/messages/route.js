import { NextResponse } from "next/server";

import { handleNewMessage, getMessages } from "@/controllers/messageController"; // Import the controller

export async function POST(req) {
  const body = await req.json();

  if (!body.sender || !body.receiver || !body.content || !body.conversationId) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  const { status, data } = await handleNewMessage(body);
  return NextResponse.json(data, { status });
}

export async function GET(req) {
  const conversationId = req.nextUrl.searchParams.get("conversationId");
  const loggedInUserId = req.nextUrl.searchParams.get("loggedInUserId");

  const { status, data } = await getMessages(conversationId, loggedInUserId);

  return NextResponse.json(data, { status });
}
