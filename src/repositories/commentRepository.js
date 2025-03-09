import Post from "@/models/postModel";

export async function createCommentInDB(postId, currentUserId, content) {
  // Create a new comment post (reply)
  const newComment = await Post.create({
    userId: currentUserId,
    content,
    parentPostId: postId,
  });

  // Update the parent post by storing the comment post ID
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: newComment._id } },
    { new: true }
  );
  // Get the updated comment count => updatedPost.comments.length
  return { newComment, commentCount: updatedPost.comments.length };
}

export async function getCommentsByPostId(postId) {
  // Fetch replies linked to this post
  return await Post.find({ parentPostId: postId })
    .populate("userId", "userName fullName") // Get user details
    .sort({ createdAt: -1 }); // Show latest first
}
