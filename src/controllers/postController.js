import { NextResponse } from "next/server";
import { createNewPost, fetchUserPosts } from "@/services/postService";

export async function createPost(req, session) {
  try {
    const { email } = session.user;
    const { content } = await req.json();

    if (!content.trim()) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    const newPost = await createNewPost(email, content);
    if (!newPost) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function getPosts(session) {
  try {
    const { email } = session.user;
    const posts = await fetchUserPosts(email);

    if (!posts) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
