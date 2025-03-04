import { NextResponse } from "next/server";
import Post from "@/models/postModel";

export const DELETE = async (req, { params }) => {
  try {
    const { postId } = await params; // Use params to get the post ID from the URL
    //console.log("✅  id is : ", id);

    const deletedPost = await Post.findByIdAndDelete(postId); // No need to wrap id in an object

    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export async function GET(req, { params }) {
  const { postId } = await params;
  try {
    //console.log("✅  postId: ", postId);
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching post" },
      { status: 500 }
    );
  }
}
