import { NextResponse } from "next/server";
import Post from "@/models/postModel";
import { User } from "@/models/userModel";

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
  try {
    const { postId } = await params;

    // Fetch post with user details, repost info, parent post, and comments
    const post = await Post.findById(postId)
      .populate({
        path: "userId",
        model: "User", // ✅ Explicitly specify the model
        select: "fullName userName image", // Get user info
      })
      .populate({
        path: "reposted",
        populate: {
          path: "userId",
          model: "User",
          select: "fullName userName image",
        },
        select: "content media userId likes reposts comments",
      })
      .populate({
        path: "parentPostId",
        //select: "_id", // Get parent post ID if it's a reply
        populate: {
          path: "userId",
          model: "User", // ✅ Explicitly specify the model
          select: "fullName userName image", // Get user info
        },
        select: "content media likes reposts comments", // Get comment details
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          model: "User", // ✅ Explicitly specify the model
          select: "fullName userName image", // Get user info
        },
        select: "content media likes reposts comments", // Get comment details
      })
      .populate({
        path: "comments",
        populate: {
          path: "comments", // Fetch child comments recursively
          populate: {
            path: "userId",
            model: "User",
            select: "fullName userName image",
          },
          select: "content media likes reposts comments",
        },
      });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }
    //console.log("✅  post is : ", post);
    // console.log("✅  post id ", post._id);
    // console.log("✔  post content ", post.content);
    // console.log("✔  post likes ", post.likes);

    // console.log("✔  post reposts ", post.reposts);
    // console.log("✔  post reposted", post.reposted);
    // console.log("✔  post parentPostId ", post.parentPostId);
     //console.log("✔  post comments ", post.comments);

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET => sample output
/*
{
  "success": true,
  "post": {
    "_id": "postId123",
    "userId": {
      "_id": "user123",
      "userName": "john_doe",
      "fullName": "John Doe",
      "image": "profile.jpg"
    },
    "content": "This is a sample post",
    "media": {
      "name": "image.png",
      "data": "...",
      "contentType": "image/png"
    },
    "likes": ["user456", "user789"],
    "reposts": ["user111", "user222"],
    "reposted": {
      "_id": "originalPostId"
    },
    "parentPostId": {
      "_id": "parentPostId123"
    },
    "comments": [
      {
        "_id": "commentId1",
        "userId": {
          "_id": "user567",
          "userName": "jane_doe",
          "fullName": "Jane Doe",
          "image": "jane.jpg"
        },
        "content": "This is a comment",
        "media": null,
        "likes": ["user999"]
      }
    ],
    "createdAt": "2025-03-06T12:00:00Z",
    "updatedAt": "2025-03-06T12:30:00Z"
  }
}
*/
