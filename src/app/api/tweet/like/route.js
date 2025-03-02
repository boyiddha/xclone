import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Post from "@/models/postModel";
import { findUserByEmail } from "@/services/userService";

export const POST = async (req) => {
  try {
    const { postId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Session from routes:", session);

    // Find user by email
    const { email } = session.user;
    const res = await findUserByEmail(email);
    
    if (!res.success) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = res.user._id.toString();

    // Toggle like using `$addToSet` and `$pull`
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const hasLiked = post.likes.includes(userId);

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      hasLiked
        ? { $pull: { likes: userId } } // Remove like
        : { $addToSet: { likes: userId } }, // Add like
      { new: true } // Return updated document
    );

    return NextResponse.json(
      { likes: updatedPost.likes.length, liked: !hasLiked },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in like/unlike API:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
