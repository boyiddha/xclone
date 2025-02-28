import { NextResponse } from "next/server";
import Post from "@/models/postModel";

export const DELETE = async (req, { params }) => {
  try {
    const { id } = await params; // Use params to get the post ID from the URL
    //console.log("✅  id is : ", id);

    const deletedPost = await Post.findByIdAndDelete(id); // No need to wrap id in an object

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
