import Post from "@/models/postModel";

export const savePost = async (userId, content, media) => {
  const newPost = new Post({ userId, content, media });
  return await newPost.save();
};

//return all post associated with this userId
export const findPostsByUserId = async (userId) => {
  return await Post.find({ userId }).sort({ createdAt: -1 });
};

// return a post associtae with this postId
export const findPostByPostId = async (postId) => {
  return await Post.findById(postId);
};

export const toggleLikeOnPost = async (postId, userId) => {
  const post = await findPostByPostId(postId);
  const hasLiked = post.likes.includes(userId);

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    hasLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
    { new: true }
  );

  return { likes: updatedPost.likes.length, liked: !hasLiked };
};
