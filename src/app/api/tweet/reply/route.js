import { NextResponse } from "next/server";
import Post from "@/models/postModel";

export async function POST(req) {
  try {
    const { postId, currentUserId, content } = await req.json();

    if (!postId || !content || !currentUserId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new comment post (reply)
    const newComment = await Post.create({
      userId: currentUserId,
      content,
      parentPostId: postId,
    });

    // Update the parent post by storing the comment post ID
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    // Get the updated comment count
    const commentCount = updatedPost.comments.length;

    return NextResponse.json(
      {
        message: "Comment posted successfully",
        replyPost: newComment,
        commentCount,
      },
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
