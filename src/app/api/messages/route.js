import { NextResponse } from "next/server";
import { saveMessage } from "@/controllers/messageController";

export async function POST(req) {
  try {
    const { sender, receiver, content } = await req.json();
    const message = await saveMessage({ sender, receiver, content });

    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
