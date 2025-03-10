import { NextResponse } from "next/server";
import Notification from "@/models/notificationModel";
import Post from "@/models/postModel";
import { User } from "@/models/userModel";

export async function POST(req) {
  try {
    const { recipient, sender, postId, type } = await req.json();

    // Ensure the recipient and sender are different
    if (recipient.toString() === sender.toString()) {
      return NextResponse.json(
        { message: "Users cannot notify themselves" },
        { status: 400 }
      );
    }

    // Ensure the post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Create notification
    const newNotification = new Notification({
      recipient,
      sender,
      post: postId,
      type,
    });

    await newNotification.save();
    return NextResponse.json(
      { message: "Notification created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log("✅  userId: ", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "fullName userName image")
      .populate("post", "content")
      .sort({ createdAt: -1 });
    //console.log("✅  notifications: ", notifications);
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
