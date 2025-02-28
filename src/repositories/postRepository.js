import Post from "@/models/postModel";

export const savePost = async (userId, content, media) => {
  const newPost = new Post({ userId, content, media });
  return await newPost.save();
};

export const findPostsByUserId = async (userId) => {
  return await Post.find({ userId }).sort({ createdAt: -1 });
};
