import { NextResponse } from "next/server";
import Post from "@/models/postModel";

export async function POST(req) {
  try {
    const { userId, content, parentPostId, media } = await req.json();

    if (!userId || !content || !parentPostId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new reply post
    const newReply = new Post({
      userId,
      content,
      media,
      parentPostId,
    });

    await newReply.save();

    // Update parent post to store user ID in comments array
    await Post.findByIdAndUpdate(parentPostId, { $push: { comments: userId } });

    return NextResponse.json(
      { message: "Reply posted successfully", reply: newReply },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting reply:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Fetch replies linked to this post
    const replies = await Post.find({ parentPostId: postId })
      .populate("userId", "userName fullName") // Get user details
      .sort({ createdAt: -1 }); // Show latest first

    return NextResponse.json(replies, { status: 200 });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
