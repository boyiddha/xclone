import Post from "@/models/postModel";

export async function createPostInDB(userId, content) {
  const newPost = new Post({ userId, content });
  return await newPost.save();
}

export async function findPostsByUser(userId) {
  const posts = await Post.find({ userId }).sort({ createdAt: -1 });
  return posts;
}
