// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { createPost, getPosts } from "@/controllers/postController";

// export async function POST(req) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   return createPost(req, session);
// }

// export async function GET(req) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   return getPosts(session);
// }

import { IncomingForm } from "formidable";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { findUserByEmail } from "@/services/userService";
import Post from "@/models/postModel";

// Disable the body parser as we need to handle the form data ourselves
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser for file uploads
  },
};

export const POST = async (request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user; // Get email from session

    // Find the user by email to get the userId
    const res = await findUserByEmail(email);
    if (!res.success) return null;
    const user = res.user;

    // Extract form data
    const data = await request.formData();
    console.log("✅  data ", data);

    // Get the image file from form data
    const file = data.get("image");

    if (!file) {
      return NextResponse.json({ success: false, message: "No image file" });
    }

    // Convert file to buffer (using .buffer() for file objects)
    const buffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // Create new post with image buffer
    const newPost = new Post({ userId: user._id, image: imageBuffer });
    await newPost.save();

    return NextResponse.json({
      response: "Successfully Uploaded",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ response: "Failed", success: false });
  }
};
// Handle GET requests to fetch posts
export async function GET(req) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user; // Get email from session

    // Find the user by email to get the userId
    const res = await findUserByEmail(email);
    if (!res.success) return null;
    const user = res.user;
    // Fetch all posts for the found userId, sorted by createdAt in descending order (newest first)
    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    console.log("✅  posts ", posts);
    // Convert image buffer to Base64 and append it to the posts data
    const postsWithImages = posts.map((post) => {
      const postData = post.toObject();

      if (post.image) {
        postData.image = `data:${post.imageType};base64,${post.image.toString(
          "base64"
        )}`;
      }

      return postData;
    });

    return NextResponse.json(postsWithImages, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
