import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { findUserByEmail } from "@/services/userService";
import {
  createPostService,
  getUserPostsService,
  likePostService,
  repostWithoutQuoteService,
} from "@/services/postService";

export const createPost = async (request) => {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user by email
    const { email } = session.user;
    const res = await findUserByEmail(email);
    if (!res.success)
      return NextResponse.json({ success: false, message: "User not found" });

    // Extract form data
    const data = await request.formData();
    const file = data.get("file");
    const content = data.get("content");

    if (!file && !content) {
      return NextResponse.json({
        success: false,
        message: "Post must contain either content or a file",
      });
    }

    // Call the service to create a post
    const newPost = await createPostService(res.user._id, content, file);

    return NextResponse.json({
      success: true,
      message: "Successfully Uploaded",
      post: newPost,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({
      success: false,
      message: "Upload Failed",
      error: error.message,
    });
  }
};

export const getPosts = async () => {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user by email
    const { email } = session.user;
    const res = await findUserByEmail(email);
    if (!res.success)
      return NextResponse.json({ success: false, message: "User not found" });

    // Fetch posts from the service
    const posts = await getUserPostsService(res.user._id);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve posts",
    });
  }
};

export const likeOrUnlikePost = async (req) => {
  try {
    const { postId, currentUserId } = await req.json();
    // console.log(`postId: ${postId}, userId: ${currentUserId}`);

    const result = await likePostService(postId, currentUserId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      { likes: result.likes, liked: result.liked },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in like/unlike Controller:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

export const repostWithoutQuote = async (req) => {
  try {
    const { postId, currentUserId } = await req.json();
    // console.log(`postId: ${postId}, userId: ${currentUserId}`);

    const result = await repostWithoutQuoteService(postId, currentUserId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      {
        reposts: result.reposts,
        reposted: result.reposted,
        newPost: result.newPost,
        removedRepostedId: result.removedRepostId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in repost without quote Controller:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
