import { NextResponse } from "next/server";
import { addComment, fetchComments } from "@/services/commentService";

export async function createComment(req) {
  try {
    const { postId, currentUserId, content } = await req.json();

    if (!postId || !content || !currentUserId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const { newComment, commentCount } = await addComment(
      postId,
      currentUserId,
      content
    );

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

export async function getComments(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    const replies = await fetchComments(postId);

    return NextResponse.json(replies, { status: 200 });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
